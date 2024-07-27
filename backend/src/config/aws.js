import { CreateTableCommand, ListTablesCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const tableName = process.env.TABLE_NAME;

export const ensureUsersTableExists = async () => {
    try {

        const listTablesCommand = new ListTablesCommand({});
        const listTablesResponse = await client.send(listTablesCommand);
        const tableExists = listTablesResponse.TableNames.includes(tableName);

        if (tableExists) {
            console.log(`Table "${tableName}" already running.`);
            return;
        }
        const createTableCommand = new CreateTableCommand({
            TableName: tableName,
            AttributeDefinitions: [
                {
                    AttributeName: "email",
                    AttributeType: "S",  // String type
                },
            ],
            KeySchema: [
                {
                    AttributeName: "email",
                    KeyType: "HASH",  // Partition key
                },
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5,
            },
        });

        const createTableResponse = await client.send(createTableCommand);
        console.log('Table created successfully:', createTableResponse);
    } catch (error) {
        console.error('Error ensuring table exists:', error);
        throw error;
    }
};

export default client;


