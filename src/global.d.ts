import { TRenderer } from './preload'
import { TChildRenderer } from './child-proc/preload'

declare global {
  interface Window {
    electron: TRenderer & TChildRenderer
  }
}