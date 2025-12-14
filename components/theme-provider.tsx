'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'
import { useTheme } from 'next-themes'
import { useEffect } from 'react'

// Componente para sincronizar el tema con las clases CSS personalizadas
function ThemeSync({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme()
  
  useEffect(() => {
    // Agregar clase específica del tema al elemento html
    const root = document.documentElement
    
    if (resolvedTheme === 'dark') {
      root.classList.add('diamante-dark')
      root.classList.remove('diamante-light')
      // También puedes establecer variables CSS personalizadas aquí si es necesario
      root.style.setProperty('--diamante-primary', '188 94% 58%') // Cyan
      root.style.setProperty('--diamante-secondary', '262 83% 58%') // Purple
    } else {
      root.classList.add('diamante-light')
      root.classList.remove('diamante-dark')
      // Valores para light mode (puedes ajustarlos según necesites)
      root.style.setProperty('--diamante-primary', '190 95% 39%') // Cyan más oscuro
      root.style.setProperty('--diamante-secondary', '262 83% 48%') // Purple más oscuro
    }
  }, [resolvedTheme])

  return <>{children}</>
}

// Props personalizadas para tu aplicación Diamante
interface DiamanteThemeProviderProps extends ThemeProviderProps {
  // Puedes agregar props específicas aquí si las necesitas
  enableDiamanteEffects?: boolean
}

export function ThemeProvider({ 
  children, 
  enableDiamanteEffects = true,
  ...props 
}: DiamanteThemeProviderProps) {
  return (
    <NextThemesProvider
      {...props}
      // Configuraciones específicas para Diamante Solana
      attribute="class"
      defaultTheme="dark" // El tema por defecto debe ser dark para tu aplicación
      enableSystem={true}
      disableTransitionOnChange={false}
      // Definir los temas disponibles
      themes={['light', 'dark', 'diamante']}
      // Forzar tema diamante si está habilitado
      forcedTheme={enableDiamanteEffects ? undefined : props.forcedTheme}
    >
      {enableDiamanteEffects ? (
        <ThemeSync>
          {children}
        </ThemeSync>
      ) : (
        children
      )}
    </NextThemesProvider>
  )
}

// Hook personalizado para usar el tema con utilidades específicas de Diamante
export function useDiamanteTheme() {
  const theme = useTheme()
  
  return {
    ...theme,
    // Utilidades específicas para Diamante
    isDiamanteTheme: theme.resolvedTheme === 'dark',
    diamanteColors: {
      primary: 'var(--diamante-primary)',
      secondary: 'var(--diamante-secondary)',
      gradient: 'linear-gradient(135deg, hsl(var(--diamante-primary)), hsl(var(--diamante-secondary)))'
    },
    // Método para cambiar a un tema específico de Diamante
    setDiamanteTheme: (themeName: 'light' | 'dark' | 'diamante') => {
      theme.setTheme(themeName === 'diamante' ? 'dark' : themeName)
    }
  }
      }         
