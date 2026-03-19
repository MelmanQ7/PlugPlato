// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
// Fuking Windows

use std::fs;
use std::path::Path; // для роботи зі шляхами файлової системи

// Команда яка повертає список папок з директорії плагінів
// Vec<String> - це як масив рядків в JS
#[tauri::command]
fn read_plugins_dir(mode: i32) -> Vec<String> {
    let mut paths: String;
    if mode == 1  {
        paths = fs::read_dir("../src/plugins").unwrap();
    } else if mode == 2 {
        paths = std::env::var("HOME").unwrap();
        format!("{}/plugplato/plugins", paths)
    }

    paths
        .map(|p| p.unwrap().file_name().to_string_lossy().to_string())
        .collect()
}

// Команда яка перевіряє чи існує index.html в папці плагіна
// String - один рядок (назва плагіна), повертає true або false
#[tauri::command]
fn plugin_exists(name: String) -> bool {
    // format! - це як шаблонний рядок в JS: `../src/plugins/${name}/index.html`
    let path = format!("../src/plugins/{}/index.html", name);
    // Path::new створює об'єкт шляху, .exists() перевіряє чи існує файл
    Path::new(&path).exists()
}

fn main() {
    tauri::Builder::default()
        // реєструємо обидві команди щоб JS міг їх викликати через invoke
        .invoke_handler(tauri::generate_handler![read_plugins_dir, plugin_exists])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}