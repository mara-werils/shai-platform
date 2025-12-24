'use client'
import { useMemo } from 'react'
import { useAppContext } from '@/context/app-context'

const useMainUserCheck = () => {
    const { userProfile } = useAppContext()

    const isMainUser = useMemo(() => {
        return !!userProfile?.is_superuser
    }, [userProfile?.is_superuser])

    return { isMainUser }
}

export default useMainUserCheck
