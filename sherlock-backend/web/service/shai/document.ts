import { get } from '../base'

export const fetchDocumentUrl = (documentId: string) => {
    return get<{ link: string }>(`/documents/${documentId}/link`)
}
