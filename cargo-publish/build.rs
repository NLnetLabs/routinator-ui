extern crate reqwest;
use flate2::read::GzDecoder;
use reqwest::header;
use std::env;
use std::fs;
use std::io;
use std::io::prelude::*;
use std::path::{Path, PathBuf};
use tar::Archive;

const _DL_URL_PATH: &str = "https://github.com/NLnetLabs/routinator-ui/releases/download";
const _DL_FILE_NAME: &str = "routinator-ui-build.tar.gz";
const RS_FILE_NAME: &str = "ui-resources.rs";
const SRC_DIR: &str = "../dist";

struct Asset {
    path: PathBuf,
    content: Vec<u8>,
}

struct Assets(Vec<Asset>);

impl Assets {
    fn new() -> Self {
        Assets(vec![])
    }

    fn from_tar_gz(&mut self, tar_gz: Vec<u8>) -> io::Result<()> {
        let mut archive = Archive::new(GzDecoder::new(tar_gz.as_slice()));
        self.0 = archive
            .entries()?
            .map(move |e| {
                let content: &mut Vec<u8> = &mut vec![];
                let mut e = e.ok()?;
                e.read_to_end(content).ok()?;
                if e.size() > 0 {
                    Some(Asset {
                        path: e.path().ok()?.to_path_buf(),
                        content: content.to_owned(),
                    })
                } else {
                    None
                }
            })
            .filter_map(|e| e)
            .collect();
        Ok(())
    }

    fn from_files(&mut self, dir: std::fs::ReadDir) -> io::Result<()> {
        for e in dir {
            let entry = e?;
            let path = entry.path();
            if path.is_dir() {
                self.from_files(path.read_dir()?)?;
            } else {
                let mut content_buf: Vec<u8> = vec![];
                fs::File::open(entry.path())?.read_to_end(&mut content_buf)?;
                self.0.push(Asset {
                    path: path
                        .strip_prefix(SRC_DIR)
                        .map_or_else(|e| Err(io::Error::new(
                            io::ErrorKind::Other,
                            format!(
                                "routinator-ui: Path of Asset file {:?} does not start with /dist: {}",
                                &path, e
                            )
                        )), |p| Ok(p.to_path_buf()))?,
                    content: content_buf,
                });
            }
        }

        Ok(())
    }

    fn write_to(self, dest_buf: std::cell::RefCell<std::fs::File>) -> io::Result<()> {
        dest_buf.borrow_mut().write_all(
            r#"mod ui_resources { pub fn endpoints_as_tuple() -> Vec<(&'static str, &'static [u8])> { vec!["#
                .as_bytes(),
        )?;

        for a in self.0 {
            add_asset_to_rs_file_from(a.path, &a.content, dest_buf.borrow_mut())?;
        }

        dest_buf.borrow_mut().write_all("]} }".as_bytes())?;

        Ok(())
    }
}

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

// fn _unpack_and_move(tar_gz: &[u8]) -> Result<(), std::io::Error> {
//     let out_dir = env::var_os("OUT_DIR").unwrap().into_string().unwrap();
//     print!("uncompressing and copying to {}...", out_dir);
//     let tar = GzDecoder::new(tar_gz);
//     let mut archive = Archive::new(tar);

//     let mut ui_buf = std::fs::File::create(Path::new(&out_dir).join(RS_FILE_NAME.to_string()))?;
//     ui_buf.write_all(
//         r#"mod ui_resources { pub fn endpoints_as_tuple() -> Vec<(String, &'static [u8])> { vec!["#
//             .as_bytes(),
//     )?;

//     for file in archive.entries()? {
//         let mut file = file?;
//         if let Ok(h) = file.header().path() {
//             if file.size() > 0 {
//                 println!("{:?}", h);
//                 let mut content_buf = Vec::<u8>::new();
//                 file.read_to_end(&mut content_buf)?;
//                 if let Ok(head) = file.header().path() {
//                     ui_buf.write_all(head.to_str().unwrap().as_bytes())?;
//                     ui_buf.write_all(format!("&{:?}", &content_buf).as_bytes())?;
//                     ui_buf.write_all("),".as_bytes())?;
//                 }
//             }
//         }
//     }
//     ui_buf.write_all("]} }".as_bytes())?;
//     println!("done!");
//     Ok(())
// }

// fn _main() {
//     let build_files_gz = _download_ui_release_build();
//     let _ok = _unpack_and_move(&build_files_gz.unwrap());
// }

// fn visit_dirs(dir: std::fs::ReadDir, cb: &dyn Fn(&DirEntry) -> io::Result<()>) -> io::Result<()> {
//     for entry in dir {
//         let entry = entry?;
//         let path = entry.path();
//         if path.is_dir() {
//             visit_dirs(path.read_dir()?, cb)?;
//         } else {
//             cb(&entry)?;
//         }
//     }
//     Ok(())
// }

// fn visit_tar_files(
//     archive: Entries<GzDecoder<&[u8]>>,
//     cb: &dyn Fn(&Entry<GzDecoder<&[u8]>>) -> io::Result<()>,
// ) -> io::Result<()> {
//     for entry in archive {
//         let entry = entry?;
//         if entry.size() > 0 {
//             cb(&entry)?;
//         }
//     }
//     Ok(())
// }

// fn visit_tar_files<'a, T: Iterator>(
//     archive: T,
//     cb: &dyn Fn(&<T as Iterator>::Item) -> io::Result<()>,
// ) -> io::Result<()>
// where
//     <T as Iterator>::Item: Read,
// {
//     for mut entry in archive {
//         let len = &entry.by_ref().bytes().count();
//         // let entry = entry?;
//         if len > &0 {
//             cb(&entry)?;
//         }
//     }
//     Ok(())
// }

// fn _remove_create_dir(dir: &Path) -> io::Result<()> {
//     if dir.exists() {
//         fs::remove_dir_all(dir)?
//     }
//     fs::create_dir(dir)
// }

// fn generic_visitor<T: Iterator /* , R: Read */>(
//     archive: T,
//     cb: &dyn Fn(&<T as Iterator>::Item) -> io::Result<()>,
// ) -> io::Result<()>
// // where
//     // io::Result<<T as Iterator>::Item>: Read,
// {
//     for entry in archive {
//         // let entry = entry?;
//         // if entry.size() > 0 {
//         cb(&entry)?;
//         // }
//     }
//     Ok(())
// }

// fn write_rs_file_to(
//     dir: io::Result<std::fs::ReadDir>,
//     dest_buf: std::cell::RefCell<std::fs::File>,
// ) -> std::io::Result<()> {
//     dest_buf.borrow_mut().write_all(
//         r#"mod ui_resources { pub fn endpoints_as_tuple() -> Vec<(String, &'static [u8])> { vec!["#
//             .as_bytes(),
//     )?;

//     // visit_dirs(dir?, &|e: &DirEntry| -> std::io::Result<()> {
//     //     let mut content_buf = Vec::<u8>::new();
//     //     fs::File::open(e.path())?.read_to_end(&mut content_buf)?;
//     //     add_asset_to_rs_file_from(
//     //         &e.path(),
//     //         "../dist".to_string(),
//     //         &content_buf,
//     //         dest_buf.borrow_mut(),
//     //     )?;
//     //     Ok(())
//     // })?;

//     generic_visitor(dir?, &|e: &io::Result<DirEntry>| -> io::Result<()> {
//         let mut content_buf = Vec::<u8>::new();
//         let e = e.as_ref().unwrap();
//         fs::File::open(e.path())?.read_to_end(&mut content_buf)?;
//         add_asset_to_rs_file_from(
//             &e.path(),
//             "../dist".to_string(),
//             &content_buf,
//             dest_buf.borrow_mut(),
//         )?;
//         Ok(())
//     })?;

//     dest_buf.borrow_mut().write_all("]} }".as_bytes())?;

//     Ok(())
// }

// fn write_from_tar_rs_file_to(
//     src_buf: Vec<u8>,
//     dest_buf: std::cell::RefCell<std::fs::File>,
// ) -> std::io::Result<()> {
//     dest_buf.borrow_mut().write_all(
//         r#"mod ui_resources { pub fn endpoints_as_tuple() -> Vec<(String, &'static [u8])> { vec!["#
//             .as_bytes(),
//     )?;
//     let mut archive = Archive::new(GzDecoder::new(src_buf.as_slice()));

//     // visit_tar_files(
//     //     archive.entries()?,
//     //     &|e: &Entry<GzDecoder<&[u8]>>| -> std::io::Result<()> {
//     //         add_asset_to_rs_file_from(
//     //             &e.path()?,
//     //             "".to_string(),
//     //             &src_buf.to_vec(),
//     //             dest_buf.borrow_mut(),
//     //         )?;
//     //         Ok(())
//     //     },
//     // )?;

//     generic_visitor(archive.entries()?, &|e: &io::Result<
//         Entry<GzDecoder<&[u8]>>,
//     >|
//      -> std::io::Result<()> {
//         let e = e.as_ref().unwrap();
//         if e.size() > 0 {
//             add_asset_to_rs_file_from(
//                 &e.path()?,
//                 "".to_string(),
//                 &src_buf.to_vec(),
//                 dest_buf.borrow_mut(),
//             )?;
//         }
//         Ok(())
//     })?;

//     dest_buf.borrow_mut().write_all("]} }".as_bytes())?;

//     Ok(())
// }

// type VisitorFn<'a, T: Iterator> = &'a dyn Fn(&<T as Iterator>::Item) -> io::Result<()>;

// fn generic_write_to_rs<'a, T: Iterator>(
//     src: T,
//     mut dest_buf: std::cell::RefMut<std::fs::File>,
//     // cb: &dyn Fn(&<T as Iterator>::Item) -> &'a dyn Fn(&Path, String, &[u8], std::cell::RefMut<fs::File>) -> std::io::Result<()>,
//     cb: &dyn Fn(&<T as Iterator>::Item, T, std::cell::RefMut<std::fs::File>) -> std::io::Result<()>,
//     visitor: &dyn Fn(T, VisitorFn<T>) -> io::Result<()>,
// ) -> std::io::Result<()> {
//     dest_buf.write_all(
//         r#"mod ui_resources { pub fn endpoints_as_tuple() -> Vec<(String, &'static [u8])> { vec!["#
//             .as_bytes(),
//     )?;

//     visitor(src, &|e| cb(&e, src, dest_buf))?;

//     dest_buf.write_all("]} }".as_bytes())?;

//     Ok(())
// }

// fn curry_asset_to_rs_file_from<'a, R: Read, T: Iterator + std::fmt::Debug>(
//     path_prefix: &'a str,
// ) -> impl Fn(&R, T, std::cell::RefMut<fs::File>) -> std::io::Result<()> + 'a {
//     move |entry: &R, content_buf: T, ui_buf: std::cell::RefMut<fs::File>| -> std::io::Result<()> {
//         add_asset_to_rs_file_from(
//             Path::new("soepath"),
//             path_prefix.to_string(),
//             content_buf,
//             ui_buf,
//         )
//     }
// }

fn add_asset_to_rs_file_from(
    src_path: PathBuf,
    content_buf: &[u8],
    mut ui_buf: std::cell::RefMut<fs::File>,
) -> io::Result<()> {
    ui_buf.write_all(format!("(\"{}\",", src_path.to_string_lossy()).as_bytes())?;
    // To shorten the content_buf to a smaller slice size to avoid
    // building the complete file lengths (for debugging purposes)
    // uncomment the /*[..10]*/ part.
    ui_buf.write_all(format!("&{:?}", &content_buf /*[10]*/).as_bytes())?;
    ui_buf.write_all("),".as_bytes())?;

    Ok(())
}

fn get_out_dir() -> Result<String, std::ffi::OsString> {
    env::var_os("OUT_DIR")
        .ok_or_else(std::ffi::OsString::new)?
        .into_string()
}

fn main() {
    println!("cargo:rerun-if-env-changed=CARGO_PKG_VERSION");
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
            eprintln!(
                    "routinator-ui: Cannot continue building. Failed to remove file {:?}: {}. Perhaps this is a read-only file system?",
                    &rs_file_path, e
                );
            std::process::exit(1);
        }
    };

    // (re)create the rs file output file.
    let rs_file_buf = match fs::File::create(&rs_file_path) {
        Ok(f) => std::cell::RefCell::new(f),
        Err(e) => {
            eprintln!(
                "routinator-ui: Cannot continue building. Failed to create file {:?}: {}",
                &rs_file_path, e
            );
            std::process::exit(1);
        }
    };

    // If RC_DIR exists (which means that a local build was made by Vue),
    // use that, otherwise download the assets file built by the release action on GitHub.
    let mut assets: Assets = Assets::new();

    match fs::read_dir(Path::new(SRC_DIR)) {
        Ok(dir) => match assets.from_files(dir) {
            Ok(_) => {}
            Err(e) => {
                eprintln!(
                    "routinator-ui: Cannot continue building. Failed to read local files from '/dist': {}",
                    e
                );
                std::process::exit(1);
            }
        },
        Err(_) => match assets.from_tar_gz(_download_ui_release_build().unwrap()) {
            Ok(_) => {}
            Err(e) => {
                eprintln!(
                    "routinator-ui: Cannot continue building. Failed to download release from github {:?}: {}",
                    &rs_file_path, e
                );
                std::process::exit(1);
            }
        },
    }

    // flush the assets to disk in a .rs file
    match assets.write_to(rs_file_buf) {
        Ok(()) => {}
        Err(e) => {
            eprintln!(
                "routinator-ui: Cannot continue building. Failed to write to file {:?}: {}",
                &rs_file_path, e
            );
            std::process::exit(1);
        }
    }

    // match write_from_tar_rs_file_to(_download_ui_release_build().unwrap(), rs_file_buf) {
    //     Ok(()) => {}
    //     Err(e) => {
    //         eprintln!(
    //             "routinator-ui: Cannot continue building. Failed to write to file {:?}: {}",
    //             &rs_file_path, e
    //         );
    //         std::process::exit(1);
    //     }
    // }

    // match generic_write_to_rs(
    //     src,
    //     rs_file_buf.borrow_mut(),
    //     // &dyn Fn(&<T as Iterator>::Item) -> dyn Fn(&[u8], std::cell::RefMut<fs::File>) -> std::io::Result<()>
    //     // &|e: &Entry<GzDecoder<&[u8]>>| -> &dyn Fn(&Path,
    //     //     String,
    //     //     &[u8],
    //     //     std::cell::RefMut<fs::File>) -> std::io::Result<()> {

    //     //         &curry_asset_to_rs_file_from(
    //     //         &e.path().unwrap(),
    //     //         "",
    //     //         // &_download_ui_release_build().unwrap(),
    //     //         // rs_file_buf.borrow_mut(),
    //     //     )
    //     &curry_asset_to_rs_file_from(""),
    //     &visit_tar_files,
    // ) {
    //     Ok(()) => {}
    //     Err(e) => {
    //         eprintln!(
    //             "routinator-ui: Cannot continue building. Failed to write to file {:?}: {}",
    //             &rs_file_path, e
    //         );
    //         std::process::exit(1);
    //     }
    // }
}
