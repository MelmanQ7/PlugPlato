// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
// Fuking Windows

use std::fs;
use std::path::Path; // для роботи зі шляхами файлової системи

fn get_plugins_path(external: bool) -> String {
    if external {
        let home = std::env::var("HOME").unwrap();
        format!("{}/plugplato/plugins", home)
    } else {
        String::from("../src/plugins")
    }
}

// Команда яка повертає список папок з директорії плагінів
// Vec<String> - це як масив рядків в JS
#[tauri::command]
fn read_plugins_dir(external: bool) -> Vec<String> {
    let dir = get_plugins_path(external);

    match fs::read_dir(&dir) {
        Ok(paths) => paths
            .map(|p| p.unwrap().file_name().to_string_lossy().to_string())
            .collect(),
        Err(_) => vec![]
    }
}

#[tauri::command]
fn read_plugin_html(name: String, external: bool) -> String {
    let base_path = get_plugins_path(external);
    let dir = format!("{}/{}", base_path, name);
    
    let mut html = fs::read_to_string(format!("{}/index.html", dir))
        .unwrap_or_default();
    
    // вставляємо base тег який каже браузеру звідки читати відносні шляхи
    let base_tag = format!("<base href=\"file://{}/\">", dir);
    html = html.replace("<head>", &format!("<head>{}", base_tag));
    
    html
}

// Команда яка перевіряє чи існує index.html в папці плагіна
// String - один рядок (назва плагіна), повертає true або false
#[tauri::command]
fn plugin_exists(name: String, external: bool) -> bool {
    let base = get_plugins_path(external);
    let path = format!("{}/{}/index.html", base, name);
    Path::new(&path).exists()
}

#[tauri::command]
fn get_home_dir() -> String {
    std::env::var("HOME").unwrap()
}

#[tauri::command]
fn install_plugin(name: String) -> bool {
    let home = std::env::var("HOME").unwrap();
    let src = format!("{}/.plugplato/plugins/{}", home, name);
    let dst = format!("../src/plugins/{}", name);
    
    // створюємо директорію призначення
    if fs::create_dir_all(&dst).is_err() {
        return false;
    }
    
    // читаємо всі файли з src і копіюємо в dst
    let entries = match fs::read_dir(&src) {
        Ok(e) => e,
        Err(_) => return false,
    };
    
    for entry in entries.flatten() {
        let src_file = entry.path();
        let dst_file = format!("{}/{}", dst, entry.file_name().to_string_lossy());
        fs::copy(&src_file, &dst_file).ok();
    }
    
    true
}

fn main() {
    tauri::Builder::default()
        // реєструємо обидві команди щоб JS міг їх викликати через invoke
        .invoke_handler(tauri::generate_handler![read_plugins_dir, plugin_exists, get_home_dir, read_plugin_html, install_plugin])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}