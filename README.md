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

Add `connection` and `root` to `deploy` in `_config.yml`.

```
deploy:
  type: ftp
  connection:
    host: <ftp host>
    port: <ftp port>
    user: <ftp user>
    password: <ftp password>
    ...
  root: <path/to/your/blog/on/the/server>
```

Connection properties:

* host - _string_ - The hostname or IP address of the FTP server. **Default:** 'localhost'

* port - _integer_ - The port of the FTP server. **Default:** 21

* secure - _mixed_ - Set to true for both control and data connection encryption, 'control' for control connection encryption only, or 'implicit' for implicitly encrypted control connection (this mode is deprecated in modern times, but usually uses port 990) **Default:** false

* secureOptions - _object_ - Additional options to be passed to `tls.connect()`. **Default:** (none)
  * Additionally you can add pfxPath, keyPath, caPath and certPath to specify the path of the file that contains data. This parameters are overrides existing ones.

* user - _string_ - Username for authentication. **Default:** 'anonymous'

* password - _string_ - Password for authentication. **Default:** 'anonymous@'

* connTimeout - _integer_ - How long (in milliseconds) to wait for the control connection to be established. **Default:** 10000

* pasvTimeout - _integer_ - How long (in milliseconds) to wait for a PASV data connection to be established. **Default:** 10000

* keepalive - _integer_ - How often (in milliseconds) to send a 'dummy' (NOOP) command to keep the connection alive. **Default:** 10000

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

----------

[Hexo]: http://hexo.io