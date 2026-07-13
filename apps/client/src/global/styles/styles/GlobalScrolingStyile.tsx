import { GlobalStyles as MUIGlobalStyles } from "@mui/material";
import { FC } from "react";
import {defaultTheme} from '../theme/models/themes'
const {success} = defaultTheme.palette

interface GlobalStylesProps {
    color?: string;
    hoverColor?: string;
    bgColor?: string;
    width?: string;
    height?: string;
}

const GlobalStyles: FC<GlobalStylesProps> = ({
    color= '#737377',
    hoverColor = success.darker,
    bgColor = '#252628',
    width= '5px',
    height= '5px', 
}) => {
    return (
        <MUIGlobalStyles
            styles={{
                ':root': {
                    '--scrollbar-width': width,
                    '--scrollbar-height': height,
                    '--scrollbar-background': bgColor,
                    '--scrollbar-thumb': color,
                    '--scrollbar-thumb-hover': hoverColor,
                    '--scrollbar-corner': 'none',
                },
                "*::webkit-scrollbar": {
                    width: 'var(--scrollbar-width)',
                    height: 'var(--scrollbar-height)',
                },
                "*::webkit-scrollbar-track": {
                   background: 'var(--scrollbar-background)',
                },
                "*::webkit-scrollbar-thumb": {
                    background: 'var(--scrollbar-thumb)',
                    borderRadius: '10px',
                },
                "*::webkit-scrollbar-thumb:hover": {
                    background: 'var(--scrollbar-thumb-hover)',
                    cursor: 'grab',
                },
                "*::webkit-scrollbar-thumb:active": {
                    background: 'var(--scrollbar-thumb-hover)',
                    cursor: 'grabbing',
                },
                "*::webkit-scrollbar-corner": {
                    display: 'none',
                },
            }}
        />
    )
}

export default GlobalStyles