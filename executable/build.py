import os
import subprocess
import shutil
import colorama
from colorama import Fore, Style


class BuildManager:
    def __init__(self):
        # Initialize colorama for colored terminal output
        colorama.init()
        self.backend_dir = os.path.abspath(
            os.path.join(os.path.dirname(__file__), "../backEnd"))
        self.output_dir = os.path.abspath(os.path.dirname(__file__))
        # Adjust this path if your entry point is different
        self.entry_point = "app/main.py"
        self.resources_folder = os.path.abspath(os.path.join(
            os.path.dirname(__file__), "../frontEnd/src/resources"))
        self.frontend_dir = os.path.abspath(
            os.path.join(os.path.dirname(__file__), "../frontEnd"))

    def print_status(self, message):
        """Print a green status message to indicate process progress"""
        print(f"{Fore.GREEN}[BUILD] {message}{Style.RESET_ALL}")

    def navigate_to_backend(self):
        """Navigate to the backend directory."""
        self.print_status(
            f"Navigating to backend directory: {self.backend_dir}")
        os.chdir(self.backend_dir)

    def build_fastapi_app(self):
        """Build the FastAPI app as an executable using PyInstaller."""
        try:
            self.print_status("Building FastAPI app with PyInstaller...")
            subprocess.run([
                "pyinstaller",
                "--name", "fastapi_app",  # Name of the output executable
                "--distpath", self.output_dir,
                "--paths", self.backend_dir,  # Add the backend directory to the Python path
                "--clean",  # Add the backend directory to the Python path
                "--noconfirm",  # Add the backend directory to the Python path
                self.entry_point
            ], check=True)
            self.print_status("FastAPI app built successfully.")
        except subprocess.CalledProcessError as e:
            print(f"{Fore.RED}Failed to build FastAPI app: {e}{Style.RESET_ALL}")
            raise

    def copy_config_file(self):
        """Copy the config.ini file to the required location."""
        source_config_path = os.path.join(self.backend_dir, "config.ini")
        destination_config_path = os.path.join(
        self.resources_folder, "_internal", "config.ini")

        try:
            # Ensure the destination directory exists
            os.makedirs(os.path.dirname(destination_config_path), exist_ok=True)

            # Copy the config.ini file
            self.print_status(
                f"Copying config.ini from {source_config_path} to {destination_config_path}")
            shutil.copy2(source_config_path, destination_config_path)
            self.print_status("Successfully copied config.ini")
        except Exception as e:
            print(f"{Fore.RED}Failed to copy config.ini: {e}{Style.RESET_ALL}")
            raise

    def remove_existing_resources(self):
        """Remove the existing resources folder in frontEnd/src."""
        if os.path.exists(self.resources_folder):
            try:
                self.print_status(
                    f"Removing existing resources folder: {self.resources_folder}")
                shutil.rmtree(self.resources_folder)
                self.print_status(
                    f"Successfully removed {self.resources_folder}")
            except Exception as e:
                print(
                    f"{Fore.RED}Failed to remove {self.resources_folder}: {e}{Style.RESET_ALL}")
                raise

    def create_resources_folder(self):
        """Create a new resources folder in frontEnd/src."""
        self.print_status(
            f"Creating new resources folder at {self.resources_folder}")
        os.makedirs(self.resources_folder, exist_ok=True)
        self.print_status(f"Successfully created {self.resources_folder}")

    def move_fastapi_resources(self):
        """Move the resources of the fastapi_app folder to ../frontEnd/src/resources."""
        source_path = os.path.join(self.output_dir, "fastapi_app")
        try:
            self.print_status(
                f"Moving FastAPI resources from {source_path} to {self.resources_folder}")
            # Copy the contents of the source folder to the destination folder
            for item in os.listdir(source_path):
                source_item = os.path.join(source_path, item)
                destination_item = os.path.join(self.resources_folder, item)

                if os.path.isdir(source_item):
                    self.print_status(f"Copying directory: {item}")
                    shutil.copytree(
                        source_item, destination_item, dirs_exist_ok=True)
                else:
                    self.print_status(f"Copying file: {item}")
                    shutil.copy2(source_item, destination_item)

            self.print_status(
                f"Successfully moved contents of {source_path} to {self.resources_folder}")

            # Optionally, remove the original source folder after copying
            self.print_status(
                f"Cleaning up: removing original folder {source_path}")
            shutil.rmtree(source_path)
            self.print_status(
                f"Successfully removed original folder: {source_path}")
        except Exception as e:
            print(
                f"{Fore.RED}Failed to move contents of {source_path} to {self.resources_folder}: {e}{Style.RESET_ALL}")
            raise

    def run_electron_build(self):
        """Run npm run electron:build in the frontEnd directory."""
        try:
            self.print_status(
                f"Changing directory to frontend: {self.frontend_dir}")
            os.chdir(self.frontend_dir)

            self.print_status("Running npm electron:build command...")
            subprocess.run(["npm", "run", "electron:build"],
                           shell=True, check=True)
            self.print_status("Electron build completed successfully.")
        except subprocess.CalledProcessError as e:
            print(f"{Fore.RED}Failed to run electron:build: {e}{Style.RESET_ALL}")
            raise

    def execute(self):
        """Execute the entire build process."""
        self.print_status("=== Starting build process ===")
        self.navigate_to_backend()
        self.build_fastapi_app()
        self.remove_existing_resources()
        self.create_resources_folder()
        self.move_fastapi_resources()
        self.copy_config_file()
        self.run_electron_build()
        self.print_status("=== Build process completed successfully ===")


if __name__ == "__main__":
    build_manager = BuildManager()
    build_manager.execute()
