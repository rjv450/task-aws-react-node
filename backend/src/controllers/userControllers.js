import { PutItemCommand, GetItemCommand, ScanCommand, BatchWriteItemCommand } from "@aws-sdk/client-dynamodb";
import dynamoDB from '../config/aws.js';

export const registerUser = async (req, res, io) => {
    const { firstName, lastName, email } = req.body;
    const registrationDate = new Date().toISOString();

    const params = {
        TableName: process.env.TABLE_NAME,
        Key: {
            email: { S: email },
        },
    };

    try {
        const getItemCommand = new GetItemCommand(params);
        const getItemResponse = await dynamoDB.send(getItemCommand);
        if (getItemResponse.Item) {
            return res.status(400).send('User already exists');
        }
        const putParams = {
            TableName: process.env.TABLE_NAME,
            Item: {
                firstName: { S: firstName },
                lastName: { S: lastName },
                email: { S: email },
                registrationDate: { S: registrationDate },
            }
        };

        const putItemCommand = new PutItemCommand(putParams);
        await dynamoDB.send(putItemCommand);

        io.emit('userRegistered', { firstName, lastName, email, registrationDate });
        res.status(201).send('User registered successfully');
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).send('Error processing request');
    }
};

export const deleteUsers = async (req, res, io) => {
    try {
        const scanCommand = new ScanCommand({
            TableName: process.env.TABLE_NAME,  // Ensure this matches your table name
        });

        const scanResponse = await dynamoDB.send(scanCommand);
        const items = scanResponse.Items;

        if (!items || items.length === 0) {
            return res.status(404).send('No users found to delete');
        }


        const deleteRequests = items.map(item => ({
            DeleteRequest: {
                Key: {
                    email: { S: item.email.S }
                }
            }
        }));

        const batchWriteCommand = new BatchWriteItemCommand({
            RequestItems: {
                "Users": deleteRequests
            }
        });

        await dynamoDB.send(batchWriteCommand);

        io.emit('userDeleted');
        res.send('All users deleted');
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).send('Error deleting users');
    }
};

export const getUsers = async (req, res) => {
    try {
      const scanCommand = new ScanCommand({
        TableName: process.env.TABLE_NAME, 
      });
  
      const scanResponse = await dynamoDB.send(scanCommand);
      res.send(scanResponse.Items || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).send('Error fetching users');
    }
  };


