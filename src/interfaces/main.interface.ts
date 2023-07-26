export type SingleCardType = {
    color: String
    title: string
    content: any
    emoji: String
    date: String
}
export type CardInfoType = {
    loading: boolean
    data: Array<SingleCardType>
    error: string
}

export type CurrentCardType = {
    loading: boolean
    data: SingleCardType
    error: string
}

export type ActionType = {
    payload: any
    type: string
    error: string
  }
