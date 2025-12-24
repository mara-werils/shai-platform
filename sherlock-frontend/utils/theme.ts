import { Theme } from '@/types/app'

export const getValidTheme = (theme_param: unknown): Theme | undefined => {
    return Object.values(Theme).includes(theme_param as Theme)
        ? (theme_param as Theme)
        : undefined
}
