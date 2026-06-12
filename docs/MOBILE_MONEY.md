# Mobile Money Integration Guide

## Configuration Orange Money

### Numéro de compte
```
656 07 96 43 - TOMDIEU WOUACHI Dinores Laurel
```

## Processus de Recharge

### 1. Utilisateur demande une recharge

```
POST /api/portfolio/recharge/request
Body:
{
  "amount": 5000,
  "payment_method": "orange_money",
  "transaction_id": "MM123456789",
  "receipt_image": <file>
}
```

### 2. Utilisateur effectue le dépôt

- Envoie l'argent via Orange Money au numéro fourni
- Reçoit un message de confirmation avec l'ID de transaction
- Prend une capture d'écran du message

### 3. Utilisateur soumet la preuve

- Charge l'image de la preuve de paiement
- Saisit l'ID de transaction
- Soumet la demande

### 4. Admin valide

L'admin voit dans le tableau de bord:
- Montant demandé
- Méthode de paiement
- ID de transaction
- Image de preuve
- Informations utilisateur

```
GET /api/admin/recharges/pending
```

### 5. Admin approuve ou rejette

```
POST /api/admin/recharges/:rechargeId/validate
Body:
{
  "action": "approve" | "reject",
  "rejection_reason": "Raison si rejet"
}
```

### 6. Portefeuille mis à jour

- Si approuvé: solde augmente immédiatement
- Si rejeté: notification envoyée à l'utilisateur

## Frais et Commission

### Recharge
- Montant minimum: **1000F** (sans frais)
- Frais bancaires: Supportés par l'utilisateur

### Transactions
```
Vente de 10 000F:
- Client paye: 10 000F
- Vendeur reçoit: 9 000F (10 000F - 10%)
- Admin reçoit: 1 000F (10%)
```

### Retrait
```
Retrait de 10 000F:
- Demande de retrait: 10 000F
- Frais: 500F (5%)
- Reçu net: 9 500F
- Admin: 500F
```
