import { reactive } from 'vue'

export const store = reactive({
    fileToEdit: null,
    fileType: null, // 'pdf' or 'blob'
    docID: null,
    setFile(file) {
        this.fileToEdit = file
    },
    setDocID(id) {
        this.docID = id
    },
    clearFile() {
        this.fileToEdit = null
        this.docID = null
    }
})
