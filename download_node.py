import urllib.request
import tarfile
import os

url = "https://nodejs.org/dist/v20.12.2/node-v20.12.2-linux-x64.tar.gz"
file_name = "node-v20.12.2-linux-x64.tar.gz"

print("Downloading Node.js gz...")
urllib.request.urlretrieve(url, file_name)
print("Downloaded. Extracting...")

import subprocess
subprocess.run(["tar", "-xzf", file_name])
print("Extracted.")
