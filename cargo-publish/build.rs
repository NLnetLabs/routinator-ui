extern crate reqwest;
use flate2::read::GzDecoder;
use reqwest::header;
use std::env;
use std::fs::{self, DirEntry};
use std::io;
use std::io::prelude::*;
use std::path::Path;
use tar::Archive;

const _DL_URL_PATH: &str = "https://github.com/NLnetLabs/routinator-ui/releases/download";
const _DL_FILE_NAME: &str = "routinator-ui-build.tar.gz";
const RS_FILE_NAME: &str = "ui-resources.rs";

fn _download_ui_release_build() -> Result<Vec<u8>, reqwest::Error> {
    let version = env!("CARGO_PKG_VERSION");
    print!("downloading latest routinator-ui release {} from ", version);
    let mut headers = header::HeaderMap::new();

    headers.insert(
        header::USER_AGENT,
        header::HeaderValue::from_str(&format!("User-Agent: routinator-ui/{}", version))
            .expect("Cannot download routinator-ui-build."),
    );
    let client = reqwest::blocking::Client::builder()
        .default_headers(headers)
        .build()?;

    let dl_url = format!("{}/v{}/{}", _DL_URL_PATH, version, _DL_FILE_NAME);
    print!("{}...", dl_url);

    let tar_gz_res = client.get(dl_url).send()?;

    if tar_gz_res.status().is_success() {
        println!("done!");
    } else {
        println!("failed!");
        println!("{}", tar_gz_res.status());
    }

    Ok(tar_gz_res.bytes()?.to_vec())
}

fn _unpack_and_move(tar_gz: Vec<u8>) -> Result<(), std::io::Error> {
    let out_dir = env::var_os("OUT_DIR").unwrap().into_string().unwrap();
    print!("uncompressing and copying to {}...", out_dir);
    let tar = GzDecoder::new(&tar_gz[..]);
    let mut archive = Archive::new(tar);

    let mut ui_buf = std::fs::File::create(Path::new(&out_dir).join(RS_FILE_NAME.to_string()))?;
    ui_buf.write_all(
        r#"mod ui_resources { pub fn endpoints_as_tuple() -> Vec<(String, &'static [u8])> { vec!["#
            .as_bytes(),
    )?;

    for file in archive.entries()? {
        let mut file = file?;
        if let Ok(h) = file.header().path() {
            if file.size() > 0 {
                println!("{:?}", h);
                let mut content_buf = Vec::<u8>::new();
                file.read_to_end(&mut content_buf)?;
                if let Ok(head) = file.header().path() {
                    ui_buf.write_all(head.to_str().unwrap().as_bytes())?;
                    ui_buf.write_all(format!("&{:?}", &content_buf).as_bytes())?;
                    ui_buf.write_all("),".as_bytes())?;
                }
            }
        }
    }
    ui_buf.write_all("]} }".as_bytes())?;
    println!("done!");
    Ok(())
}

fn _main() {
    let build_files_gz = _download_ui_release_build();
    let _ok = _unpack_and_move(build_files_gz.unwrap());
}

fn visit_dirs(dir: &Path, cb: &dyn Fn(&DirEntry) -> io::Result<()>) -> io::Result<()> {
    if dir.is_dir() {
        for entry in fs::read_dir(dir)? {
            let entry = entry?;
            let path = entry.path();
            if path.is_dir() {
                visit_dirs(&path, cb)?;
            } else {
                cb(&entry)?;
            }
        }
    }
    Ok(())
}

fn _remove_create_dir(dir: &Path) -> io::Result<()> {
    if dir.exists() {
        fs::remove_dir_all(dir)?
    }
    fs::create_dir(dir)
}

fn write_rs_file_to(dest_buf: std::cell::RefCell<std::fs::File>) -> std::io::Result<()> {
    dest_buf.borrow_mut().write_all(
        r#"mod ui_resources { pub fn endpoints_as_tuple() -> Vec<(String, &'static [u8])> { vec!["#
            .as_bytes(),
    )?;

    visit_dirs(
        Path::new("../dist"),
        &|e: &DirEntry| -> std::io::Result<()> {
            add_asset_to_rs_file_from(&e.path(), dest_buf.borrow_mut())?;
            Ok(())
        },
    )?;

    dest_buf.borrow_mut().write_all("]} }".as_bytes())?;

    Ok(())
}

fn add_asset_to_rs_file_from(
    src_path: &Path,
    mut ui_buf: std::cell::RefMut<fs::File>,
) -> io::Result<()> {
    let mut content_buf = Vec::<u8>::new();
    let mut asset_file = fs::File::open(src_path)?;
    asset_file.read_to_end(&mut content_buf)?;
    ui_buf.write_all(
        format!(
            "(\"{}\".to_string(),",
            src_path
                .strip_prefix("../dist")
                .map_or_else(
                    |e| Err(io::Error::new(
                        io::ErrorKind::Other,
                        format!(
                            "routinator-ui: Path of Asset file {:?} does not start with /dist: {}",
                            &src_path, e
                        )
                    )),
                    Ok
                )?
                .to_str()
                .map_or_else(
                    || Err(io::Error::new(
                        io::ErrorKind::Other,
                        format!(
                            "routinator-ui: Path of Asset file {:?} contains invalid characters.",
                            &src_path
                        )
                    )),
                    |v| { Ok(v) }
                )?
        )
        .as_bytes(),
    )?;
    // To shorten the content_buf to a smaller slice size to avoid
    // building the complete file lengths (for debugging purposes)
    // uncomment the /*[..10]*/ part.
    ui_buf.write_all(format!("&{:?}", &content_buf /*[..10]*/).as_bytes())?;
    ui_buf.write_all("),".as_bytes())?;

    Ok(())
}

fn get_out_dir() -> Result<String, std::ffi::OsString> {
    env::var_os("OUT_DIR")
        .ok_or_else(std::ffi::OsString::new)?
        .into_string()
}

fn main() {
    println!("cargo:rerun-if-changed=build.rs");
    println!("cargo:rerun-if-changed=../dist");

    let rs_file_path: std::path::PathBuf;
    if let Ok(out_dir) = get_out_dir() {
        rs_file_path = Path::new(&out_dir).join(RS_FILE_NAME.to_string());
    } else {
        panic!("in the streets of London.");
    };

    // remove old rs file, if it exists. Will also catch read-only a file-system.
    if fs::metadata(&rs_file_path).is_ok() {
        if let Err(e) = fs::remove_file(&rs_file_path) {
            panic!(
                    "routinator-ui: Cannot continue building. Failed to remove file {:?}: {}. Perhaps this is a read-only file system?",
                    &rs_file_path, e
                );
        }
    };

    // (re)create the rs file output file.
    let rs_file_buf = match fs::File::create(&rs_file_path) {
        Ok(f) => std::cell::RefCell::new(f),
        Err(e) => panic!(
            "routinator-ui: Cannot continue building. Failed to create file {:?}: {}",
            &rs_file_path, e
        ),
    };

    // fill the rs file with assets.
    match write_rs_file_to(rs_file_buf) {
        Ok(()) => {}
        Err(e) => {
            eprintln!(
                "routinator-ui: Cannot continue building. Failed to write to file {:?}: {}",
                &rs_file_path, e
            );
            std::process::exit(1);
        }
    }
}
