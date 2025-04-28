import os
import sys
from pathlib import Path

def find_and_print_frontend_components(project_dir, output_file=None):
    """
    Findet alle Frontend-Komponenten (.tsx-Dateien) im Projekt und gibt deren vollständigen Inhalt aus.
    Optional kann die Ausgabe in eine Datei geschrieben werden.
    """
    categories = {
        'pages': [],          # Page-Komponenten (page.tsx)
        'layouts': [],        # Layout-Komponenten (layout.tsx)
        'ui_components': [],  # UI-Komponenten (in /components/ui)
        'feature_components': [],  # Feature-spezifische Komponenten
        'chart_components': [],  # Chart/Diagramm-Komponenten
        'form_components': [],  # Formular-Komponenten
        'layout_components': []  # Layout-spezifische Komponenten
    }

    project_path = Path(project_dir)

    # Alle .tsx-Dateien finden und kategorisieren
    for tsx_file in project_path.rglob('*.tsx'):
        try:
            rel_path = tsx_file.relative_to(project_path)
            rel_path_str = str(rel_path)

            # Nur Dateien in src/app und src/components berücksichtigen
            if not (rel_path_str.startswith('src' + os.sep + 'app') or
                    rel_path_str.startswith('src' + os.sep + 'components')):
                continue

            # Komponenten kategorisieren
            if tsx_file.name == 'page.tsx':
                categories['pages'].append((rel_path_str, tsx_file))
            elif tsx_file.name == 'layout.tsx':
                categories['layouts'].append((rel_path_str, tsx_file))
            elif ('components' + os.sep + 'ui') in rel_path_str:
                categories['ui_components'].append((rel_path_str, tsx_file))
            elif ('components' + os.sep + 'charts') in rel_path_str:
                categories['chart_components'].append((rel_path_str, tsx_file))
            elif ('components' + os.sep + 'forms') in rel_path_str:
                categories['form_components'].append((rel_path_str, tsx_file))
            elif ('components' + os.sep + 'layout') in rel_path_str:
                categories['layout_components'].append((rel_path_str, tsx_file))
            elif ('components') in rel_path_str:
                categories['feature_components'].append((rel_path_str, tsx_file))
        except ValueError:
            continue

    # Ausgabe vorbereiten
    if output_file:
        f = open(output_file, 'w', encoding='utf-8')
        original_stdout = sys.stdout
        sys.stdout = f

    try:
        print("=== FRONTEND-KOMPONENTEN MIT VOLLSTÄNDIGEM CODE ===\n")

        total_components = 0

        # Alle Kategorien mit Inhalten ausgeben
        for category_name, files in categories.items():
            if files:
                category_title = category_name.replace('_', ' ').upper()
                print(f"{'=' * 80}")
                print(f"== {category_title} ({len(files)}) ==")
                print(f"{'=' * 80}\n")

                for rel_path, file_path in sorted(files):
                    try:
                        # Dateiinhalt lesen
                        with open(file_path, 'r', encoding='utf-8') as src_file:
                            content = src_file.read()

                        # Header für die Komponente
                        print(f"\n{'#' * 80}")
                        print(f"# KOMPONENTE: {rel_path}")
                        print(f"{'#' * 80}\n")

                        # Vollständigen Inhalt ausgeben
                        print(content)
                        print("\n\n")
                    except Exception as e:
                        print(f"FEHLER beim Lesen von {rel_path}: {str(e)}\n\n")

                total_components += len(files)

        print(f"\nGESAMT: {total_components} Frontend-Komponenten wurden ausgegeben.")

    finally:
        # Zurücksetzen des stdout, falls in eine Datei geschrieben wurde
        if output_file:
            sys.stdout = original_stdout
            f.close()
            print(f"Ergebnisse wurden in '{output_file}' gespeichert.")

def main():
    """Hauptfunktion."""
    # Projektverzeichnis (kann bei Bedarf angepasst werden)
    project_dir = "C:/Development/RDAuswertung"

    if not os.path.exists(project_dir):
        print(f"Fehler: Das Verzeichnis '{project_dir}' existiert nicht.")
        sys.exit(1)

    # Ausgabedatei definieren
    output_file = os.path.join(project_dir, "frontend_components_full.txt")

    # Komponenten finden und Inhalt ausgeben
    find_and_print_frontend_components(project_dir, output_file)

if __name__ == "__main__":
    main()