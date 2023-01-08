<script setup>
import { computed, ref } from 'vue'

import { useLocale, useNamespace } from '../../../hooks/index.js'
import { NIconCheck, NIconCheckCircle, NIconClose, NIconDelete, NIconDocument } from '../../../icons/index.js'
import { NProgress } from '../../progress/index.js'
import { uploadListEmits, uploadListProps } from './upload-list.js'

const props = defineProps(uploadListProps)
const emit = defineEmits(uploadListEmits)
/** @type{import('vue').ComputedRef<import('./upload.types.js').UploadFile[]>} */
// @ts-ignore
const propsFiles = computed(() => props.files)

defineOptions({
  name: 'NUploadList',
})

const { locale } = useLocale()
const nsUpload = useNamespace('upload')
const nsIcon = useNamespace('icon')
const nsList = useNamespace('list')

const focusing = ref(false)

/**
 * @param {import('./upload.types.js').UploadFile} file
 */
const handleRemove = (file) => {
  emit('remove', file)
}
</script>

<template>
  <TransitionGroup
    tag="ul"
    :class="[nsUpload.b('list'), nsUpload.bm('list', listType), nsUpload.is('disabled', disabled)]"
    :name="nsList.b()"
  >
    <li
      v-for="file in propsFiles"
      :key="file.uid || file.name"
      :class="[
        nsUpload.be('list', 'item'),
        nsUpload.beIs('list', 'item', file.status),
        nsUpload.beIs('list', 'item', 'focusing', focusing),
      ]"
      tabindex="0"
      @keydown.delete="
        // @ts-ignore
        !disabled && handleRemove(file)
      "
      @focus="focusing = true"
      @blur="focusing = false"
      @click="focusing = false"
    >
      <slot :file="file">
        <img
          v-if="listType === 'picture' || (file.status !== 'uploading' && listType === 'picture-card')"
          :class="nsUpload.be('list', 'item-thumbnail')"
          :src="file.url"
          alt=""
        />
        <div
          v-if="file.status === 'uploading' || listType !== 'picture-card'"
          :class="nsUpload.be('list', 'item-info')"
        >
          <a :class="nsUpload.be('list', 'item-name')" @click.prevent="handlePreview(file)">
            <span class="n-icon" :class="nsIcon.m('document')"><NIconDocument /></span>
            <span :class="nsUpload.be('list', 'item-file-name')">
              {{ file.name }}
            </span>
          </a>
          <NProgress
            v-if="file.status === 'uploading'"
            :type="listType === 'picture-card' ? 'circle' : 'line'"
            :stroke-width="listType === 'picture-card' ? 6 : 2"
            :percentage="Number(file.percentage)"
            :style="listType === 'picture-card' ? '' : 'margin-top: 0.5rem'"
          />
        </div>

        <label :class="nsUpload.be('list', 'item-status-label')">
          <span
            v-if="listType === 'text'"
            class="n-icon"
            :class="[nsIcon.m('upload-success'), nsIcon.m('circle-check')]"
          >
            <NIconCheckCircle />
          </span>
          <span
            v-else-if="['picture-card', 'picture'].includes(listType)"
            class="n-icon"
            :class="[nsIcon.m('upload-success'), nsIcon.m('check')]"
          >
            <NIconCheck />
          </span>
        </label>
        <span
          v-if="!disabled"
          class="n-icon"
          :class="nsIcon.m('close')"
          @click="
            // @ts-ignore
            handleRemove(file)
          "
        >
          <NIconClose />
        </span>
        <!-- Из-за того, что близкая кнопка появляется только тогда, когда li фокусируется, исчезает после того, как li становится размытым, поэтому навигация с помощью клавиатуры никогда не может достичь близкой кнопки -->
        <!-- Это ошибка, которую необходимо исправить -->
        <!-- TODO: исправить неправильное взаимодействие с навигацией-->
        <i v-if="!disabled" :class="nsIcon.m('close-tip')">{{ locale.el.upload.deleteTip }}</i>
        <span v-if="listType === 'picture-card'" :class="nsUpload.be('list', 'item-actions')">
          <span :class="nsUpload.be('list', 'item-preview')" @click="handlePreview(file)">
            <span class="n-icon" :class="nsIcon.m('zoom-in')">ZoomIn</span>
          </span>
          <span v-if="!disabled" :class="nsUpload.be('list', 'item-delete')" @click="handleRemove(file)">
            <span class="n-icon" :class="nsIcon.m('delete')"><NIconDelete /></span>
          </span>
        </span>
      </slot>
    </li>
    <slot name="append" />
  </TransitionGroup>
</template>
