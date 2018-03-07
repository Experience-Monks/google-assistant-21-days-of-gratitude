'use strict';

class LogController {
  /**
   * Creates new instance of LogController
   * @constructor
   * @param  {Object} meta Global meta object to include with every log
   * @param  {Array}  tags Global tags to include with every log
   * @return {this}        Instance of LogController
   */
  constructor(meta, tags) {
    meta = meta || {};
    tags = tags || [];
    /**
     * Access to the un-instantiated LogController class
     * @type {LogController}
     */
    this.LogHandler = LogController;
    /**
     * Global configuration for the class
     * @type {Object}
     */
    this.config = {
      // Global meta object to include with every log
      meta,
      // Global tags array to include with every log
      tags,
      // Enable debugging mode (log.debug messages)
      debug: false,
      // Enable development mode which pretty-prints the log object to the console
      dev: false,
      // Disables logging to the console (used for testing)
      silent: false
    };
  }

  /**
   * @param  {String|Error}    msg  Message to log. Can be any type, but string or `Error` reccommended.
   * @param  {Object} meta Optional meta data to attach to the log.
   * @return {Object}      The compiled log object that was logged to the console.
   *
   * @example
   * const log = require('lambda-log');
   *
   * log.info('Test info log');
   */
  info(msg, meta) {
    meta = meta || {};
    return this.log('info', msg, meta);
  }

  /**
   * @param  {String|Error}    msg  Message to log. Can be any type, but string or `Error` reccommended.
   * @param  {Object} meta Optional meta data to attach to the log.
   * @return {Object}      The compiled log object that was logged to the console.
   *
   * @example
   * const log = require('lambda-log');
   *
   * log.warn('Test warn log');
   */
  warn(msg, meta) {
    meta = meta || {};
    return this.log('warn', msg, meta);
  }

  /**
   * @param  {String|Error}    msg  Message to log. Can be any type, but string or `Error` reccommended.
   * @param  {Object} meta Optional meta data to attach to the log.
   * @return {Object}      The compiled log object that was logged to the console.
   *
   * @example
   * const log = require('lambda-log');
   *
   * log.error('Test error log');
   */
  error(msg, meta) {
    meta = meta || {};
    return this.log('error', msg, meta);
  }

  /**
   * @param  {String|Error}    msg  Message to log. Can be any type, but string or `Error` reccommended.
   * @param  {Object} meta Optional meta data to attach to the log.
   * @return {Object}      The compiled log object that was logged to the console.
   *
   * @example
   * const log = require('lambda-log');
   *
   * log.debug('Test debug log');
   */
  debug(msg, meta) {
    meta = meta || {};
    return this.log('debug', msg, meta);
  }

  /**
   * Creates log message based on the provided parameters
   * @param  {String} level LogController level (`info`, `debug`, `warn` or `error`)
   * @param  {String|Error}    msg   Message to log. Can be any type, but string or `Error` reccommended.
   * @param  {Object} meta  Optional meta data to attach to the log.
   * @return {Object}       The compiled log object that was logged to the console.
   */
  log(level, msg, meta) {
    meta = meta || {};
    if (['info', 'warn', 'error', 'debug'].indexOf(level) === -1) {
      throw new Error(`"${level}" is not a valid log level`);
    }

    if (level === 'debug' && !this.config.debug) return false;

    let tags = ['log', level].concat(this.config.tags),
      errorMeta = {};

    // If `msg` is an Error-like object, use the message and add the `stack` to `meta`
    if (LogController.isError(msg)) {
      errorMeta.stack = msg.stack;
      msg = msg.message;
    }
    const id = meta.hasOwnProperty('id') ? meta.id : null;
    const userId = meta.hasOwnProperty('userId') ? meta.userId : null;
    const metadata = Object.assign({}, meta || {}, this.config.meta, errorMeta);
    let data = Object.assign({ msg }, metadata, { _tags: tags });
    if (userId) data = Object.assign({ userId }, data);
    if (id) data = Object.assign({ id }, data);

    // let data = (userId) ? Object.assign({userId: userId}, {msg}, metadata, {_tags: tags}) : Object.assign({msg}, metadata, {_tags: tags});

    if (!this.config.silent) {
      let method = level === 'debug' ? 'log' : level;
      console[method](JSON.stringify(data, null, this.config.dev ? 4 : 0));
    }

    return data;
  }

  /**
   * Checks if value is an Error or Error-like object
   * @static
   * @param  {Any}     val Value to test
   * @return {Boolean}     Whether the value is an Error or Error-like object
   */
  static isError(val) {
    return !!val && typeof val === 'object' && (
      val instanceof Error || (
        val.hasOwnProperty('message') && val.hasOwnProperty('stack')
      )
    );
  }
}

module.exports = new LogController();
