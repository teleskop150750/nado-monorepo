import type { ComputedRef, InjectionKey } from 'vue'

export interface UploadContext {
  accept: ComputedRef<string>
}

export const UPLOAD_CONTEXT_INJECTION_KEY: InjectionKey<UploadContext>
