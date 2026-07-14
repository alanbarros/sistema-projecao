import { ItemType, BlockType, MomentoLiturgico, ITEM_TYPES, BLOCK_TYPES, MOMENTOS_LITURGICOS } from 'shared';

export { ItemType, BlockType, MomentoLiturgico, ITEM_TYPES, BLOCK_TYPES, MOMENTOS_LITURGICOS };

export interface ItemBloco {
  id?: number;
  tipo: BlockType;
  conteudo: string;
  ordem?: number;
}

export interface ItemColetanea {
  id: number;
  titulo: string;
  tipo: ItemType;
  blocos: ItemBloco[];
  created_at: string;
  updated_at: string;
}

export interface ListarItensResponse {
  itens: ItemColetanea[];
  total: number;
  offset: number;
  limit: number;
}

export interface ListarItensParams {
  q?: string;
  tipo?: ItemType;
  offset?: number;
  limit?: number;
}

const API_BASE = '/api';

export async function listarItens(params: ListarItensParams = {}): Promise<ListarItensResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.q) searchParams.set('q', params.q);
  if (params.tipo) searchParams.set('tipo', params.tipo);
  if (params.offset !== undefined) searchParams.set('offset', params.offset.toString());
  if (params.limit !== undefined) searchParams.set('limit', params.limit.toString());
  
  const response = await fetch(`${API_BASE}/itens?${searchParams.toString()}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao listar itens');
  }
  
  return response.json();
}

export async function buscarItemPorId(id: number): Promise<ItemColetanea> {
  const response = await fetch(`${API_BASE}/itens/${id}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao buscar item');
  }
  
  return response.json();
}

export interface CriarItemDTO {
  titulo: string;
  tipo: ItemType;
  blocos: { tipo: BlockType; conteudo: string }[];
}

export async function criarItem(dados: CriarItemDTO): Promise<ItemColetanea> {
  const response = await fetch(`${API_BASE}/itens`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dados)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(JSON.stringify(error));
  }
  
  return response.json();
}

export async function atualizarItem(id: number, dados: Partial<CriarItemDTO>): Promise<ItemColetanea> {
  const response = await fetch(`${API_BASE}/itens/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dados)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(JSON.stringify(error));
  }
  
  return response.json();
}

export async function excluirItem(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/itens/${id}`, {
    method: 'DELETE'
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao excluir item');
  }
}

export interface Roteiro {
  id: number;
  titulo: string;
  descricao?: string;
  dataCelebracao?: string;
  itens: ItemRoteiro[];
  created_at: string;
  updated_at: string;
}

export interface ItemRoteiro {
  id: number;
  roteiroId: number;
  itemColetaneaId?: number;
  tituloSnapshot: string;
  tipoSnapshot: ItemType;
  momentoLiturgico?: string;
  posicao: number;
  isAdHoc: boolean;
  marcaAguaAtiva: boolean;
  blocos: ItemRoteiroBloco[];
  created_at: string;
}

export interface ItemRoteiroBloco {
  id: number;
  tipo: BlockType;
  conteudo: string;
  ordem: number;
}

export interface ListarRoteirosResponse {
  roteiros: Roteiro[];
  total: number;
  offset: number;
  limit: number;
}

export interface ListarRoteirosParams {
  q?: string;
  offset?: number;
  limit?: number;
}

export async function listarRoteiros(params: ListarRoteirosParams = {}): Promise<ListarRoteirosResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.q) searchParams.set('q', params.q);
  if (params.offset !== undefined) searchParams.set('offset', params.offset.toString());
  if (params.limit !== undefined) searchParams.set('limit', params.limit.toString());
  
  const response = await fetch(`${API_BASE}/roteiros?${searchParams.toString()}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao listar roteiros');
  }
  
  return response.json();
}

export async function buscarRoteiroPorId(id: number): Promise<Roteiro> {
  const response = await fetch(`${API_BASE}/roteiros/${id}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao buscar roteiro');
  }
  
  return response.json();
}

export interface CriarRoteiroDTO {
  titulo: string;
  descricao?: string;
  data_celebracao?: string;
}

export async function criarRoteiro(dados: CriarRoteiroDTO): Promise<Roteiro> {
  const response = await fetch(`${API_BASE}/roteiros`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dados)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(JSON.stringify(error));
  }
  
  return response.json();
}

export async function atualizarRoteiro(id: number, dados: Partial<CriarRoteiroDTO>): Promise<Roteiro> {
  const response = await fetch(`${API_BASE}/roteiros/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dados)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(JSON.stringify(error));
  }
  
  return response.json();
}

export async function excluirRoteiro(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/roteiros/${id}`, {
    method: 'DELETE'
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao excluir roteiro');
  }
}

export interface AdicionarItemRoteiroDTO {
  itemColetaneaId: number;
  momentoLiturgico?: string;
}

export async function adicionarItemAoRoteiro(roteiroId: number, dados: AdicionarItemRoteiroDTO): Promise<ItemRoteiro> {
  const response = await fetch(`${API_BASE}/roteiros/${roteiroId}/itens`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dados)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(JSON.stringify(error));
  }
  
  return response.json();
}

export interface CriarItemAdHocDTO {
  titulo: string;
  tipo: ItemType;
  blocos: { tipo: BlockType; conteudo: string }[];
}

export async function criarItemAdHoc(roteiroId: number, dados: CriarItemAdHocDTO): Promise<ItemRoteiro> {
  const response = await fetch(`${API_BASE}/roteiros/${roteiroId}/itens/ad-hoc`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dados)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(JSON.stringify(error));
  }
  
  return response.json();
}

export interface AtualizarItemRoteiroDTO {
  momentoLiturgico?: string | null;
  marcaAguaAtiva?: boolean;
}

export async function atualizarItemRoteiro(roteiroId: number, itemId: number, dados: AtualizarItemRoteiroDTO): Promise<ItemRoteiro> {
  const response = await fetch(`${API_BASE}/roteiros/${roteiroId}/itens/${itemId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dados)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(JSON.stringify(error));
  }
  
  return response.json();
}

export async function removerItemDoRoteiro(roteiroId: number, itemId: number): Promise<void> {
  const response = await fetch(`${API_BASE}/roteiros/${roteiroId}/itens/${itemId}`, {
    method: 'DELETE'
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao remover item do roteiro');
  }
}

export async function reordenarItens(roteiroId: number, itemIds: number[]): Promise<void> {
  const response = await fetch(`${API_BASE}/roteiros/${roteiroId}/itens/reorder`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ item_ids: itemIds })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(JSON.stringify(error));
  }
}
