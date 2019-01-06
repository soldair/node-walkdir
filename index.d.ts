declare module 'walkdir' {
  import { Stats } from 'fs';

  interface WalkerOptions {
    follow_symlinks?: boolean;
    no_recurse?: boolean;
    max_depth?: number;
    track_inodes?: boolean;
  }

  interface WalkerSyncOptions extends WalkerOptions {
    return_object?: boolean;
    no_return?: boolean;
  }

  type FileCallback = (path: string, stat: Stats) => void;
  type ErrorCallback = (error: Error) => void;
  type DiscoveryType = 'path'
    | 'file'
    | 'directory'
    | 'link'
    | 'socket'
    | 'fifo'
    | 'characterdevice'
    | 'blockdevice'
    | 'targetdirectory'
    | 'empty';

  type ErrorType = 'error' | 'fail';

  class WalkerEmitter {
    on(eventType: DiscoveryType, callback: FileCallback): WalkerEmitter;
    on(eventTyoe: ErrorType, callback: ErrorCallback): WalkerEmitter;
    on(eventType: 'end', callback: () => void): WalkerEmitter;

    end(): WalkerEmitter;
    pause(): WalkerEmitter;
    resume(): WalkerEmitter;
    ignore(paths: string | string[]): WalkerEmitter;
  }

  interface API {
    (path: string, options?: WalkerOptions, callback?: FileCallback): WalkerEmitter;
    (path: string, callback?: FileCallback): WalkerEmitter;

    sync(path: string, options?: WalkerSyncOptions): string[];
    sync(path: string, options?: WalkerSyncOptions, callback?: FileCallback): void;
  }

  var walkdir: API;
  export = walkdir;
}
