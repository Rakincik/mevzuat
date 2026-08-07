const fs = require('fs');
const path = require('path');

const conversationIds = [
  '06812b09-0625-46c0-a4ef-8ef3d73bf110',
  '0eee6ea3-9e0f-4e7a-aeb7-032fe06b4f4a',
  '15c6ce1a-4220-4fce-8e7e-42df51f7d62a',
  '1c369a7b-9415-4261-ba77-9e1462ecf443',
  '2324bbfc-2094-4bdd-8dc8-4fc5a30d9702',
  '3e941528-ceee-4813-845f-d58a9085c412',
  '425d8fc7-4888-4ffe-a9d3-c9bb28caba43',
  '42cc7e5a-df91-4f85-a374-d3915851e8fe',
  '53250035-37c6-46e9-b6d4-d58f3769ee68',
  '56f7a1f0-4249-4e36-b017-1ba7396388f8',
  '5aba7f7f-a599-488e-abad-433414d16242',
  '5cd13237-540e-4f69-9fc4-f6ccb501ad26',
  '69456d14-bc31-4970-83f5-c855fe98eb01',
  '702fd864-757a-4d2d-a34e-75ccf87c5348',
  '8cc75a7a-6b20-4707-bc09-d14fba468a2a',
  '99165b3f-fdfc-4641-83f9-9e75c158b325',
  '9d10f7a6-3bac-4378-99a8-20283b697526',
  'abc6e53d-5d62-49fc-a43f-cf05b852c39f',
  'b5faf5ba-eee4-4423-aff2-93fff0951db5',
  'da91741e-3068-4706-9fd8-fa2fb79d022c',
  'db641439-bece-4dd6-9a26-9d38627e89d6',
  'df312edd-2adf-45f2-b5fb-1478fcf1833a',
  'e4f2ab6f-1190-4db8-ad25-d9f25dadca36',
  'ef5bf1b3-2338-47dd-ad74-d69c8206e0d8',
  'f2a095e6-918f-413e-a8be-c7c5ab974e07',
  'c7f47964-89a5-48d7-b1af-5e0a05a3884e',
  '6c11ed83-e3d9-4d7e-a11f-6aa27ac30618'
];

const brainDir = 'C:\\Users\\Rüstem\\.gemini\\antigravity-ide\\brain';

for (const id of conversationIds) {
  const dirPath = path.join(brainDir, id);
  const exists = fs.existsSync(dirPath);
  const logPath = path.join(dirPath, '.system_generated', 'logs', 'transcript.jsonl');
  const logExists = fs.existsSync(logPath);
  console.log(`ID ${id}: exists=${exists}, logExists=${logExists}`);
}
