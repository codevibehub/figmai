# Deploy Guide - AI Flow Builder Enterprise

## Vercel Deploy

### 1. Primeiro Deploy

```bash
# Instalar Vercel CLI se ainda não tiver
npm i -g vercel

# Fazer login no Vercel
vercel login

# Deploy inicial (vai configurar o projeto)
vercel

# Deploy para produção
vercel --prod
```

### 2. Deploy Automático

O projeto está configurado para deploy automático no Vercel:

- **Preview**: Todo push para branches que não sejam `main`
- **Production**: Todo push para branch `main`

### 3. Configurações do Projeto

- **Framework**: Next.js
- **Node Version**: 18.x
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm ci`

### 4. Variáveis de Ambiente

Se necessário, configure no painel do Vercel:

```env
NODE_ENV=production
```

### 5. Domínio Personalizado

No painel do Vercel:
1. Vá para Settings → Domains
2. Adicione seu domínio personalizado
3. Configure os DNS conforme instruções

### 6. Performance

O projeto inclui:
- ✅ Next.js App Router
- ✅ Otimização de imagens
- ✅ Headers de segurança
- ✅ Cache otimizado
- ✅ Bundle splitting automático

### 7. Monitoramento

- **Analytics**: Habilitado automaticamente no Vercel
- **Speed Insights**: Disponível no painel
- **Web Vitals**: Monitoramento automático

## URLs após Deploy

- **Production**: `https://ai-flow-builder-enterprise.vercel.app`
- **Preview**: URLs geradas automaticamente para cada branch

## Scripts Úteis

```bash
# Deploy de preview
npm run preview

# Deploy de produção
npm run deploy

# Limpar cache local
npm run clean

# Verificar build local
npm run build
npm run start
```

## Troubleshooting

### Build Errors
```bash
# Verificar tipos TypeScript
npm run type-check

# Verificar linting
npm run lint

# Build local para debug
npm run build
```

### Performance Issues
- Use o Vercel Analytics para identificar gargalos
- Monitore o bundle size
- Otimize imagens e assets

---

**Desenvolvido por**: CodeVibeHub  
**Repositório**: https://github.com/codevibehub/figmai