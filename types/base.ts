export type Base = {
    is_active: boolean
    created_at: string
    updated_at: string
}

export type BaseResponse<T> = {
    success: boolean,
    code: number,
    message?: string,
    data: T
}