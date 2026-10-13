# Pasta de Credenciais da Conta de Serviço (Google Cloud)

Nesta pasta deve ser colocado o arquivo `service-account.json` obtido no **Google Cloud Console**.

### Como obter o arquivo:
1. Acesse o **Google Cloud Console** (https://console.cloud.google.com).
2. Vá em **IAM e Administração** > **Contas de Serviço (Service Accounts)**.
3. Crie uma Conta de Serviço (ex: `stgp-dependentes-sheets@seu-projeto.iam.gserviceaccount.com`).
4. Clique na conta criada > Aba **Chaves (Keys)** > **Adicionar Chave** > **Criar Nova Chave** (Tipo: **JSON**).
5. O arquivo será baixado no seu computador. Renomeie-o para `service-account.json` e coloque-o nesta pasta:
   `backend/credentials/service-account.json`

> ⚠️ **Atenção:** Nunca publique esse arquivo em repositórios públicos. Ele está configurado no `.gitignore` para ser ignorado pelo Git.
