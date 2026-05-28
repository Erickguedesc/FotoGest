import { useCallback, useEffect, useState } from 'react'

import { homepageConfigService } from '../services/homepageConfigService'

const defaultPortfolioFotos = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600',
    alt: 'Newborn',
    label: 'Ana Clara - Newborn',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600',
    alt: 'Gestante',
    label: 'Família Silva',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1543342384-1f1350e27861?w=600',
    alt: 'Casal',
    label: 'Ensaio Gestante',
  },
]

const defaultSobreEstatisticas = [
  { value: '10', label: 'Famílias' },
  { value: '1', label: 'Anos de experiência' },
  { value: '100%', label: 'Amor em cada click' },
]

export const DEFAULT_HOMEPAGE_CONFIG = {
  heroSelo: 'Fotografia Atemporal',
  heroTitulo: 'Meu Portfólio',
  heroTituloDestaque: 'de memórias',
  heroSubtitulo: 'Ensaios Newborn · Gestante · Família',
  heroBotaoTexto: 'Ver Galeria',
  heroBotaoLink: '#portfolio',

  sobreImagemUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600',
  sobreImagemAlt: 'Fotógrafa FotoGest',
  sobreTitulo: 'Prazer,',
  sobreTituloDestaque: 'sua fotógrafa.',
  sobreTexto1:
    'Acredito que a fotografia vai além de um clique técnico; é sobre capturar a essência da conexão humana. Na FotoGest, meu objetivo é criar um legado visual para sua família.',
  sobreTexto2:
    'Especialista em ensaios Newborn, Gestante e Família, busco a luz natural e a verdade em cada olhar.',
  sobreEstatisticas: defaultSobreEstatisticas,

  portfolioSelo: 'Galeria',
  portfolioTitulo: 'Olhares',
  portfolioTituloDestaque: 'Capturados',
  portfolioFotos: defaultPortfolioFotos,

  contatoTitulo: 'Solicite um orçamento',
  contatoTexto: 'Dê o primeiro passo para eternizar seus momentos.\nRetornaremos no WhatsApp em até 24h.',
  whatsappNumero: '553199646207',

  footerEstudioNome: 'FOTOGEST',
  footerSlogan: 'Fotografia afetiva para famílias, gestantes e recém-nascidos.',
  footerEmail: 'contato@fotogest.com.br',
  footerWhatsapp: '553199646207',
  footerInstagram: '@fotogest',
  footerCidade: 'Belo Horizonte, MG',

  footerTexto: '© 2026 FOTOGEST - TODOS OS DIREITOS RESERVADOS',
  footerAdminTexto: 'Área Administrativa',
  footerAdminLink: '/Login',
  sobreImagemPublicId: null,
}

const normalizeArray = (value, fallback) => {
  if (!Array.isArray(value) || value.length === 0) {
    return fallback
  }

  return value.map((item, index) => ({
    ...fallback[index],
    ...item,
    id: item?.id ?? fallback[index]?.id ?? index + 1,
  }))
}

export function normalizeHomepageConfig(config = {}) {
  return {
    ...DEFAULT_HOMEPAGE_CONFIG,
    ...config,
    portfolioFotos: normalizeArray(config.portfolioFotos, DEFAULT_HOMEPAGE_CONFIG.portfolioFotos),
    sobreEstatisticas: normalizeArray(
      config.sobreEstatisticas,
      DEFAULT_HOMEPAGE_CONFIG.sobreEstatisticas,
    ),
  }
}

export function useHomepageConfig() {
  const [config, setConfig] = useState(DEFAULT_HOMEPAGE_CONFIG)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadConfig() {
      try {
        const response = await homepageConfigService.buscar()
        if (active) {
          setConfig(normalizeHomepageConfig(response.data))
        }
      } catch (error) {
        console.warn('[Homepage] Não foi possível carregar a configuração:', error?.response?.data || error)
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadConfig()

    return () => {
      active = false
    }
  }, [])

  const atualizarConfig = useCallback(async (dados) => {
    const normalized = normalizeHomepageConfig(dados)
    const response = await homepageConfigService.atualizar(normalized)
    const savedConfig = normalizeHomepageConfig(response.data || normalized)
    setConfig(savedConfig)
    return savedConfig
  }, [])

  return {
    config,
    loading,
    atualizarConfig,
  }
}
