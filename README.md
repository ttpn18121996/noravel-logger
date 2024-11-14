# Noravel logger

This is a support library for Nam's projects.

## Content

- [Installation](#installation)
- [Quick start](#quick-start)
- [Log storage path](#log-storage-path)
- [Channel](#channel)
  - [Add the custom channel](#add-the-custom-channel)
  - [Use channels flexibly](#use-channels-flexibly)
- [Set file name prefix](#set-file-name-prefix)

## Installation

```bash
npm i @noravel/logger
```

## Quick start

```javascript
const { Logger } = require('@noravel/logger');
// OR
import { Logger } from '@noravel/logger';
```

```javascript
Logger.emergency('Emergency');
Logger.alert('Alert');
Logger.critical('Critical');
Logger.error('Whoop! Something went wrong.');
Logger.warning('Warning');
Logger.notice('Notice');
Logger.info('Hello world!');
Logger.debug('Debug');
```

## Log storage path

By default, the log file is stored in the outermost directory of the project.

```
projects/
└── single_log.log
```

You can configure the path of the log file to store by following.

```javascript
Logger.configure({
  path: path.join(__dirname, 'storage/logs'),
});
```

```bash
mkdir -p ./storage/logs
```

Logger does not create directories automatically, so you must make sure your directories are created beforehand.
After configuration, the directory structure will look like this.

```
projects/
└── storage/
    └── logs/
        └── single.log
```

## Group storage path

```javascript
Logger.configure({
  group_path: {
    errors: [LOG_LEVEL.EMERGENCY, LOG_LEVEL.ALERT, LOG_LEVEL.CRITICAL, LOG_LEVEL.ERROR],
  },
});
```

## Channel

We supported 2 drivers and 2 channels as `single` and `daily`.

The `single` driver stores the log file as `single.log`.
It will store all in a file.

```log
[2024-01-01 00:00:00] [EMERGENCY] Emergency
[2024-01-01 00:00:01] [ALERT] Alert
[2024-01-01 00:00:02] [CRITICAL] Critical
[2024-01-01 00:00:03] [ERROR] Whoop! Something went wrong.
[2024-01-01 00:00:04] [WARNING] Warning
[2024-01-01 00:00:05] [NOTICE] Notice
[2024-01-01 00:00:06] [INFO] Hello world!
[2024-01-01 00:00:07] [DEBUG] Debug
```

The `daily` driver stores the log file as `{YYYY-MM-DD}.log`. The log will be saved by day for each respective file.

```javascript
Logger.configure({
  channel: 'daily', // By default single
});
```

```
projects/
└── storage/
    └── logs/
        └── daily-2024-01-01.log
```

```log
[00:00:00] [EMERGENCY] Emergency
[00:00:01] [ALERT] Alert
[00:00:02] [CRITICAL] Critical
[00:00:03] [ERROR] Whoop! Something went wrong.
[00:00:04] [WARNING] Warning
[00:00:05] [NOTICE] Notice
[00:00:06] [INFO] Hello world!
[00:00:07] [DEBUG] Debug
```

### Add the custom channel

```javascript
Logger.addChannel({
  name: 'error',
  driver: 'single',
  path: 'custom',
  level: LOG_LEVEL.ERROR,
});

Logger.configure({
  channel: 'error',
  path: join(__dirname, 'storage/logs'),
});

Logger.emergency('Emergency');
Logger.alert('Alert');
Logger.critical('Critical');
Logger.error('Whoop! Something went wrong.');
Logger.warning('Warning');
Logger.notice('Notice');
Logger.info('Hello world!');
Logger.debug('debug');
```

Check the content log in path `storage/logs/custom/error.log`.
You will only see logs with levels equal to or higher than errors.

```
[00:00:00] [EMERGENCY] Emergency
[00:00:01] [ALERT] Alert
[00:00:02] [CRITICAL] Critical
[00:00:03] [ERROR] Whoop! Something went wrong.
```

### Use channels flexibly

You can use channels flexibly instead of just using the initially installed channel.

```javascript
Logger.channel('single').info('Hello');
Logger.channel('daily').info('Good morning');
Logger.info('Default');
```

The folder structure will look like this.

```
projects/
└── storage/
    └── logs/
        ├── custom
        |   └── error.log
        ├── daily-2024-01-01.log
        └── single.log
```

## Set file name prefix

```javascript
Logger.configure({
  prefix: 'noravel',
});
```

With the `single` driver

```
projects/
└── storage/
    └── logs/
        └── noravel-single.log
```

With the `daily` driver

```
projects/
└── storage/
    └── logs/
        └── noravel-2024-01-01.log
```
