include!(concat!(env!("OUT_DIR"), "/ui-resources.rs"));

pub mod endpoints {

    #[allow(non_camel_case_types)]
    pub enum ContentType {
        css,
        html,
        ico,
        js,
        svg,
        ttf,
        woff,
        woff2,
    }

    pub fn retrieve_content_type(path: &str) -> std::io::Result<&'static [u8]> {
        match path.split('.').last().ok_or_else(|| std::io::Error::new(
            std::io::ErrorKind::Other,
            format!("{}: filename has no extension, don't know how to map this to a content_type. Maybe add an extension or add a default content_type (dangerous!)", &path),
        ))? {
            "css" => Ok(b"text/css"),
            "html" => Ok(b"text/html"),
            "ico" => Ok(b"image/x-icon"),
            "js" => Ok(b"application/javascript"),
            "svg" => Ok(b"image/svg+xml"),
            "ttf" => Ok(b"font/ttf"),
            "woff" => Ok(b"font/woff"),
            "woff2" => Ok(b"font/woff2"),
            ext => Err(std::io::Error::new(
                std::io::ErrorKind::Other,
                format!("{}: Can't find proper content_type. Maybe add a file extension -> content_type mapping.", &ext),
            )),
        }
    }

    #[derive(Debug)]
    pub struct UiResource {
        pub endpoint: &'static str,
        pub content_type: &'static [u8],
        pub content: &'static [u8],
    }

    // A printed list of all endpoints that are in the generated
    // ui_resources.rs file. Mainly for debugging.
    pub fn get_endpoints() -> Vec<std::io::Result<UiResource>> {
        crate::ui_resources::endpoints_as_tuple()
            .into_iter()
            .map(|r| -> std::io::Result<UiResource> {
                Ok(UiResource {
                    content_type: retrieve_content_type(&r.0)?,
                    endpoint: r.0,
                    content: r.1,
                })
            })
            .collect()
    }

    // The main API, return a response payload for a given request path.
    // This request path should be passed in WITHOUT the BASE_DIR prefix, e.g
    // `index.html`, NOT `/ui/index.html`
    pub fn ui_resource(path: &std::path::Path) -> Option<UiResource> {
        let path = path.to_str()?;
        let resource = *crate::ui_resources::endpoints_as_tuple()
            .iter()
            .find(|r| r.0 == path)?;

        Some(UiResource {
            content_type: retrieve_content_type(&resource.0).ok()?,
            endpoint: resource.0,
            content: resource.1,
        })
    }
}
