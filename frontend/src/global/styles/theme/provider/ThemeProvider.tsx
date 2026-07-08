import  CssBaseline  from "@mui/material/CssBaseline";
import { FC, ReactNode } from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { defaultTheme } from "../models/themes";
import GlobalStyles from "../../styles/GlobalScrolingStyile";

type ThemeProviderProps = {
    children: ReactNode
}

const ThemeProvider:FC<ThemeProviderProps> = ({children}) => (
    <MuiThemeProvider theme={defaultTheme}>
        <CssBaseline/>
        <GlobalStyles/>
        {children}
    </MuiThemeProvider>
)

export default ThemeProvider