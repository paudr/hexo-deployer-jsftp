hexo-deployer-jsftp
===================

FTP deployer plugin for http://hexo.io/

## Usage

### Install

```
npm install hexo-deployer-jsftp --save
```

### Enable

Set `deploy.type` to `ftp` in `_config.yml`.

``` yaml
deploy:
  type: ftp
```

### Configure

Add `host`, `user` and `root` to `deploy` in `_config.yml`.

```
deploy:
  type: ftp
  host: <ftp host>
  port: <ftp port>
  user: <ftp user>
  password: <ftp password>
  root: <path/to/your/blog/on/the/server>
```

### Usage

Type deploy command in console.
```
hexo deploy [host=<ftp host>] [port=<ftp port>] [user=<ftp user>] [password=<ftp password>]
```
Command line parameters overrides the default configuration.

### Disable

Remove `ftp` value from `deploy.type` in `_config.yml`.

``` yaml
deploy:
  type:
```

### Update

Execute the following command.

```
npm update
```

### Uninstall

Execute the following command. Don't forget to disable the plugin before uninstalling.

```
npm uninstall hexo-deployer-jsftp
```

[


----------


Hexo]: http://hexo.io