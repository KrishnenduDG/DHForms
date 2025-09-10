<script setup lang="ts">
import CryingJSON from '@/assets/lotties/crying.json'
import HandshakeJSON from '@/assets/lotties/handshake.json'
import WarningJSON from '@/assets/lotties/warning.json'
import { onMounted, reactive, ref, watch } from 'vue'
import { AiOutlinePlus } from 'vue-icons-plus/ai'
import { BsCheck2Circle, BsXCircle } from 'vue-icons-plus/bs'
import { useToast } from 'vue-toast-notification'
import { Vue3Lottie } from 'vue3-lottie'
import { APIService } from './api'
import { type IFormData, type IHandshakeData } from './types'
import { removeIdxElementFromArray, uint8ToBase64 } from './utils'
import { aesEncrypt } from './utils/encryption'
import { generatePrivateKey, modPow } from './utils/handshake'

const toast = useToast()

const handshakeError = ref(null)
const isHandshakeCompleted = ref(false)
const isStaleSession = ref(false)
const formData = ref<Array<any>>([])
const isFormIncomplete = ref(true)
const isFormSubmitting = ref(false)

const handshakeData = reactive<IHandshakeData>({
  sessionId: null,
  g: null,
  p: null,
  clientPrivateKey: null,
  clientPubKey: null,
  serverPubKey: null,
  finalEncryptionKey: null,
})

const handleInitHandshake = async () => {
  // Get Init Handshake Secret
  try {
    const { data } = await APIService.getInitHandshakeSecrets()
    handshakeData.sessionId = data.data.sessionId
    handshakeData.g = data.data.g
    handshakeData.p = data.data.p
    handshakeData.serverPubKey = data.data.serverPubKey
  } catch (error: any) {
    console.log(error.response.data)
    handshakeError.value = error.response.data.msg
    return
  }

  // Create a Key and generate client side's counterpart
  const clientPrivateKey = generatePrivateKey()
  handshakeData.clientPrivateKey = clientPrivateKey

  // Create the client public key
  const clientPublicKey = modPow(
    BigInt(handshakeData.g!),
    BigInt(clientPrivateKey),
    BigInt(handshakeData.p!),
  )
  handshakeData.clientPubKey = clientPublicKey

  try {
    // Make the API Call to send client public key to server
    await APIService.sendClientPublicKey(handshakeData.sessionId!, clientPublicKey)
  } catch (error: any) {
    console.log(error.response.data)
    handshakeError.value = error.response.data.msg
    return
  }

  // Generating the final key
  handshakeData.finalEncryptionKey = modPow(
    BigInt(handshakeData.serverPubKey!),
    BigInt(clientPrivateKey),
    BigInt(handshakeData.p!),
  )

  // Completing the Handshake
  isHandshakeCompleted.value = true
}

const handleAddField = () => {
  formData.value = [...formData.value, ['', '']]
  isFormIncomplete.value = true
}

const handleRemoveField = (idx: number) => {
  formData.value = removeIdxElementFromArray(formData.value, idx)
  setFormCompletionStatus()
}

const handleKeyInput = (idx: number, value: string) => {
  formData.value[idx][0] = value
  setFormCompletionStatus()
}

const handleValueInput = (idx: number, value: string) => {
  formData.value[idx][1] = value
  setFormCompletionStatus()
}

const setFormCompletionStatus = () => {
  if (formData.value.length === 0) {
    isFormIncomplete.value = true
    return
  }

  for (let entry of formData.value) {
    if (entry[0] === '' || entry[1] === '') {
      isFormIncomplete.value = true
      return
    }
  }
  isFormIncomplete.value = false
}

const handleFormSubmit = async () => {
  isFormSubmitting.value = true

  let formDataObj: IFormData = {}

  for (let entry of formData.value) {
    formDataObj[entry[0] as string] = entry[1]
  }

  const { iv, cipherText } = await aesEncrypt(
    handshakeData.finalEncryptionKey!,
    JSON.stringify(formDataObj),
  )

  const reqPayload = {
    sessionId: handshakeData.sessionId!,
    iv: uint8ToBase64(iv),
    encryptedData: uint8ToBase64(cipherText),
  }

  try {
    await APIService.sendEncryptedData(reqPayload)
    toast.success('Data Submitted Successfully!')

    setTimeout(() => {
      isStaleSession.value = true
    }, 1500)
  } catch (error) {
    toast.error('Failed to save data.. Try refreshing')
    isFormSubmitting.value = false
  }
}

// Error also means that handshake is complete
watch(handshakeError, () => {
  isHandshakeCompleted.value = true
})

onMounted(handleInitHandshake)
</script>

<template>
  <div class="w-screen h-screen">
    <div v-if="isStaleSession" class="w-full h-full flex justify-center items-center">
      <div class="flex flex-col justify-center items-center">
        <Vue3Lottie :animationData="WarningJSON" :height="200" :width="200" />
        <p class="font-bold text-red-400">Session already used.. Try Refreshing!!</p>

        <p class="font-light text-red-400">Every refresh creates a new session.. Use Wisely!!</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="!isHandshakeCompleted" class="w-full h-full flex justify-center items-center">
      <div>
        <Vue3Lottie :animationData="HandshakeJSON" :height="200" :width="200" />
        <p class="font-extralight">Please wait while Handshake is going on...</p>
      </div>
    </div>

    <!-- If Error -->
    <div v-if="handshakeError" class="w-full h-full flex justify-center items-center">
      <div class="flex flex-col justify-center items-center">
        <Vue3Lottie :animationData="CryingJSON" :height="200" :width="200" />
        <p class="font-bold text-red-400">Sorry!! Handshake Failed..</p>

        <p class="font-light text-red-400">Try refreshing the browser..</p>
      </div>
    </div>

    <!-- If loaded without error -->
    <div
      v-if="isHandshakeCompleted && !handshakeError && !isStaleSession"
      class="w-full h-full p-8"
    >
      <div class="mb-3">
        <button class="btn btn-ghost" @click="handleAddField">
          <AiOutlinePlus />
          Add Details
        </button>
      </div>

      <!-- Rows -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div v-for="(formKey, idx) in formData" class="flex mb-3 gap-2">
          <input
            type="text"
            placeholder="Enter the Name"
            class="input input-neutral"
            @input="(e) => handleKeyInput(idx, (e.target as HTMLInputElement).value)"
          />
          <input
            type="text"
            placeholder="Enter the Value"
            class="input input-neutral"
            @input="(e) => handleValueInput(idx, (e.target as HTMLInputElement).value)"
          />
          <button class="btn btn-ghost btn-circle" @click="handleRemoveField(idx)">
            <BsXCircle class="text-red-500" />
          </button>
        </div>
      </div>
      <!-- Submit -->
      <div>
        <button
          class="btn btn-success"
          :disabled="isFormIncomplete || isFormSubmitting"
          @click="handleFormSubmit"
        >
          <BsCheck2Circle />
          Submit Form
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
