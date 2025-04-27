import os
import sys

def create_directory(path):
    """Creates a directory if it doesn't exist."""
    # Replace square brackets with alternative for Windows
    safe_path = path.replace('[', '_').replace(']', '_')
    if not os.path.exists(safe_path):
        os.makedirs(safe_path)
        print(f"Created directory: {safe_path}")

def create_empty_file(path):
    """Creates an empty file if it doesn't exist."""
    # Replace square brackets with alternative for Windows
    safe_path = path.replace('[', '_').replace(']', '_')
    # Ensure the directory exists
    dir_path = os.path.dirname(safe_path)
    if not os.path.exists(dir_path):
        os.makedirs(dir_path)
    if not os.path.exists(safe_path):
        with open(safe_path, 'w') as f:
            pass
        print(f"Created empty file: {safe_path}")

def setup_project():
    # Base directory
    base_dir = r"C:\Development\RDAuswertung"
    create_directory(base_dir)

    # Change to base directory
    os.chdir(base_dir)

    # Create directories - using Windows-safe naming
    directories = [
        # GitHub Actions
        ".github/workflows",
        # Husky for git hooks
        ".husky",
        # VS Code settings
        ".vscode",
        # Public assets
        "public/images",
        # Prisma ORM
        "prisma",
        # Next.js App Router structure
        "src/app/api/standorte",
        "src/app/api/standorte/[id]",
        "src/app/api/raumbuch",
        "src/app/api/raumbuch/[id]",
        "src/app/api/export",
        "src/app/api/export/excel/[id]",
        "src/app/api/export/pdf/[id]",
        "src/app/(dashboard)",
        "src/app/standorte/[id]",
        "src/app/report/[id]",
        "src/app/export/excel/[id]",
        "src/app/export/pdf/[id]",
        # React components
        "src/components/ui",
        "src/components/charts",
        "src/components/forms",
        "src/components/layout",
        "src/components/raumbuch",
        # Configuration
        "src/config",
        # Utility functions and hooks
        "src/lib",
        "src/hooks",
        # Data models and schemas
        "src/models",
        "src/schemas",
        # Business logic services
        "src/services",
        "src/services/analysis",
        "src/services/database",
        "src/services/export",
        # Global styles
        "src/styles",
        # TypeScript type definitions
        "src/types",
        # Tests
        "tests/unit",
        "tests/integration",
        "tests/e2e",
    ]

    for directory in directories:
        create_directory(os.path.join(base_dir, directory))

    # Create empty files - using Windows-safe naming
    files = [
        # GitHub workflow
        ".github/workflows/ci.yml",
        # Husky hooks
        ".husky/pre-commit",
        # VS Code settings
        ".vscode/settings.json",
        ".vscode/extensions.json",
        # Prisma schema
        "prisma/schema.prisma",
        # Next.js app files
        "src/app/layout.tsx",
        "src/app/page.tsx",
        "src/app/(dashboard)/layout.tsx",
        "src/app/(dashboard)/page.tsx",
        "src/app/standorte/[id]/page.tsx",
        "src/app/standorte/[id]/layout.tsx",
        "src/app/report/[id]/page.tsx",
        "src/app/report/[id]/layout.tsx",
        # API Routes
        "src/app/api/standorte/route.ts",
        "src/app/api/standorte/[id]/route.ts",
        "src/app/api/raumbuch/route.ts",
        "src/app/api/raumbuch/[id]/route.ts",
        "src/app/api/export/excel/[id]/route.ts",
        "src/app/api/export/pdf/[id]/route.ts",
        # Export Routes
        "src/app/export/excel/[id]/route.ts",
        "src/app/export/pdf/[id]/route.ts",
        # UI Components
        "src/components/ui/button.tsx",
        "src/components/ui/card.tsx",
        "src/components/ui/table.tsx",
        "src/components/ui/select.tsx",
        "src/components/ui/input.tsx",
        "src/components/ui/alert.tsx",
        "src/components/ui/loader.tsx",
        # Chart Components
        "src/components/charts/bereich-chart.tsx",
        "src/components/charts/rg-chart.tsx",
        "src/components/charts/etage-chart.tsx",
        # Form Components
        "src/components/forms/standort-select.tsx",
        "src/components/forms/filter-form.tsx",
        # Layout Components
        "src/components/layout/header.tsx",
        "src/components/layout/footer.tsx",
        "src/components/layout/sidebar.tsx",
        # Raumbuch Components
        "src/components/raumbuch/raumbuch-table.tsx",
        "src/components/raumbuch/summary-grid.tsx",
        "src/components/raumbuch/summary-box.tsx",
        "src/components/raumbuch/filter-bar.tsx",
        # Configuration
        "src/config/database.ts",
        "src/config/app.ts",
        # Utility libraries
        "src/lib/db.ts",
        "src/lib/utils.ts",
        "src/lib/formatters.ts",
        "src/lib/validators.ts",
        # Custom hooks
        "src/hooks/use-raumbuch-data.ts",
        "src/hooks/use-standorte.ts",
        "src/hooks/use-filter.ts",
        # Models and types
        "src/models/raumbuch.ts",
        "src/models/standort.ts",
        # Zod schemas for validation
        "src/schemas/raumbuch.schema.ts",
        "src/schemas/standort.schema.ts",
        # Services
        "src/services/database/client.ts",
        "src/services/database/queries.ts",
        "src/services/analysis/raumbuch-analysis.ts",
        "src/services/analysis/calculate-summary.ts",
        "src/services/analysis/prepare-visualization.ts",
        "src/services/export/excel-export.ts",
        "src/services/export/pdf-export.ts",
        # Styles
        "src/styles/globals.css",
        # Types
        "src/types/database.types.ts",
        "src/types/raumbuch.types.ts",
        "src/types/standort.types.ts",
        # Tests - Unit
        "tests/unit/services/analysis.test.ts",
        "tests/unit/components/raumbuch-table.test.tsx",
        "tests/unit/hooks/use-raumbuch-data.test.ts",
        # Tests - Integration
        "tests/integration/api/standorte.test.ts",
        "tests/integration/services/export.test.ts",
        # Tests - E2E
        "tests/e2e/navigation.test.ts",
        "tests/e2e/filtering.test.ts",
        # Configuration files
        ".env",
        ".env.example",
        ".eslintrc.json",
        ".gitignore",
        ".prettierrc",
        "jest.config.js",
        "next.config.js",
        "package.json",
        "postcss.config.js",
        "tailwind.config.js",
        "tsconfig.json",
        "README.md",
    ]

    for file in files:
        create_empty_file(os.path.join(base_dir, file))

    print("\nProject structure setup complete!")
    print(f"Project created at: {base_dir}")
    print("\nNOTE: For Next.js dynamic routes, we've used '[id]' instead of '[id]' due to")
    print("Windows file system limitations. When working in your Next.js project, you'll need to")
    print("replace '[id]' with '[id]' in your import statements and file references.")
    print("\nNext steps:")
    print("1. Navigate to the project directory: cd " + base_dir)
    print("2. Initialize the project: npm init -y")
    print("3. Install core dependencies:")
    print("   npm install next react react-dom typescript @types/react @types/node")
    print("4. Install development dependencies:")
    print("   npm install -D tailwindcss postcss autoprefixer prisma @prisma/client")
    print("   npm install -D jest @types/jest ts-jest @testing-library/react @testing-library/jest-dom")
    print("5. Initialize Tailwind CSS: npx tailwindcss init -p")
    print("6. Initialize Prisma: npx prisma init")
    print("7. Start the development server: npm run dev")

if __name__ == "__main__":
    setup_project()