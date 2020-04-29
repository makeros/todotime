# Todotime

App for timeboxing your tasks from Todoist.

![App Release](https://github.com/makeros/todotime/workflows/App%20Release/badge.svg)

## Built with

- JavaScript
- [Electron](https://www.electronjs.org/)
- [Elm](https://elm-lang.org/)
- [UIKit](https://getuikit.com/)

## Development

### Handy request examples for todoist

- get active tasks for today
```
curl -X GET https://api.todoist.com/rest/v1/tasks?filter=today -H "Authorization: Bearer $token"
```

- get all available labels
```
curl -X GET https://api.todoist.com/rest/v1/labels -H "Authorization: Bearer $token"
```

### Run with debug
Running the dist package from with `open` (MacOS) will open a terminal and show the console for nodejs.
```
open dist/mac/Todotime.app/Contents/MacOS/Todotime
```

### Assets

#### Icons

 - Application icons generated with [IconGenerator](https://github.com/onmyway133/IconGenerator)
 - Icons added to the electron build resources. Important - the name must be `icon.icns` because then electron takes them by default.
