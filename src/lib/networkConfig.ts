import type { NetworkConfig, NetworkId } from '@/types'

export const NETWORKS: Record<NetworkId, NetworkConfig> = {
  mtn: {
    id: 'mtn',
    label: 'MTN Ghana',
    abbr: 'MTN',
    primaryColor: '#FFC107',
    secondaryColor: '#FF8F00',
    bgColor: '#FFFDE7',
    textColor: '#5D4037',
    borderColor: '#FFD54F',
  },
  telecel: {
    id: 'telecel',
    label: 'Telecel Ghana',
    abbr: 'TC',
    primaryColor: '#E3000B',
    secondaryColor: '#B71C1C',
    bgColor: '#FFEBEE',
    textColor: '#B71C1C',
    borderColor: '#EF9A9A',
  },
  airteltigo: {
    id: 'airteltigo',
    label: 'AirtelTigo',
    abbr: 'AT',
    primaryColor: '#003B8E',
    secondaryColor: '#E40000',
    bgColor: '#E8EEF9',
    textColor: '#003B8E',
    borderColor: '#90CAF9',
  },
}

export const NETWORK_LIST = Object.values(NETWORKS)
