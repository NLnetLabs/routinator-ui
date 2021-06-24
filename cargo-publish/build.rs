extern crate reqwest;
use flate2::read::GzDecoder;
use reqwest::header;
use std::env;
use tar::Archive;

const DL_URL_PATH: &str = "https://github.com/NLnetLabs/routinator-ui/releases/download";
const DL_FILE_NAME: &str = "routinator-ui-build.tar.gz";

fn download_ui_release_build() -> Result<Vec<u8>, reqwest::Error> {
    let version = env!("CARGO_PKG_VERSION");
    print!("downloading latest routinator-ui release {}...", version);
    let mut headers = header::HeaderMap::new();

    headers.insert(
        header::USER_AGENT,
        header::HeaderValue::from_str("User-Agent: routinator/0.9.0-dev")
            .expect("Cannot download routinator-ui-build."),
    );
    let client = reqwest::blocking::Client::builder()
        .default_headers(headers)
        .build()?;

    let dl_url = format!("{}/v{}/{}", DL_URL_PATH, version, DL_FILE_NAME);
    println!("{}", dl_url);

    let tar_gz_res = client.get(dl_url).send()?;

    if tar_gz_res.status().is_success() {
        println!("done!");
    } else {
        println!("failed!");
        println!("{}", tar_gz_res.status());
    }

    Ok(tar_gz_res.bytes()?.to_vec())
}

fn unpack_and_move(tar_gz: Vec<u8>) -> Result<(), std::io::Error> {
    print!("uncompressing and copying...");
    let tar = GzDecoder::new(&tar_gz[..]);
    let mut archive = Archive::new(tar);
    let out_dir = env::var_os("OUT_DIR").unwrap();
    archive.unpack(format!(
        "{}/{}/",
        out_dir.into_string().unwrap(),
        "contrib/routinator-ui"
    ))?;
    println!("done!");
    Ok(())
}

fn main() {
    let build_files_gz = download_ui_release_build();
    let _ok = unpack_and_move(build_files_gz.unwrap());
}
