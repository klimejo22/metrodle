import type React from "react"

export interface DebugProps {
    isMobile: boolean
}

export const Debug : React.FC<DebugProps> = ({isMobile}) => {
    if (isMobile) {
        return (
            <>
                <p>Jsi na mobile</p>
            </>
        )
    } else {
        return (
            <>
                <p>Nejsi na mobile</p>
            </>
        )
    }
}

export default Debug