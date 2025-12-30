# uRL Directory Downloader

A simple and easy way to download student/faculty info from uRL for clubs, service drives, classes etc...

## How to use

### Step 1

Open the correct `.js` file and copy **everything** inside of it.
- for downloading student information copy `download_student_directory.js`
- for downloading faculty information copy `download_faculty_directory.js`

### Step 2

Once you have copied the full contents of the file to your clipboard, you can log onto uRL and navigate to either the **student** or **faculty** directory

### Step 3

Open the chrome console by pressing `Cmd + Option + J` (Mac) or `Ctrl + Shift + J` (Windows). Then paste the file you copied earlier into the console and press `Enter`.
> [!IMPORTANT]
> Because of an update to Chrome you will get a warning when you try to do this. Type "allow pasting" to enable pasting in the console.

### Step 4

Press `Enter` to run the script. The script will automatically:
1. Navigate through all people in the directory
2. Collect all the information
3. Download a CSV file with the data to your computer

### Step 5

The CSV file will be automatically downloaded to your default downloads folder. You can now open it with Numbers, Google Sheets, or something else.

## Example Output

Here's an example of the data that will be downloaded:

### Student Directory

| Name | Email | Class | PhotoURL |
|------|-------|-------|----------|
| Dillan Akinc | dillan.akinc@roxburylatin.org | 2026 | https://bbk12e1-cdn.myschoolcdn.com/... |
| Milo Choumert | milo.choumert@roxburylatin.org | 2028 | https://bbk12e1-cdn.myschoolcdn.com/... |
| Riley Alqueza | riley.alqueza@roxburylatin.org | 2028 | https://bbk12e1-cdn.myschoolcdn.com/... |

### Faculty Directory

| Name | Email | Roles | AlumniYear | PhotoURL |
|------|-------|-------|------------|----------|
| Mr. Michael Beam | michael.beam@roxburylatin.org | English, Classics | 2010 | https://bbk12e1-cdn.myschoolcdn.com/... |
| Dr. Arthur Beauregard | arthur.beauregard@roxburylatin.org | Mathematics, Science | | https://bbk12e1-cdn.myschoolcdn.com/... |
| Mr. George Matthews | george.matthews@roxburylatin.org | Classics | 2008 | https://bbk12e1-cdn.myschoolcdn.com/... |

## Requirements

- Google Chrome (or any other Chromium-based browser)