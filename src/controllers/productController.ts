import { Request, Response } from "express";
import sendResponse from "../utils/sendResponse";
import { createProduct, getAllProducts, getProductByCode, getProductById, updateProduct } from "../models/productModel";

async function getProducts(req: Request, res: Response): Promise<void> {
  
    let message;

    try {
        
        const products = await getAllProducts();

        if(products){
            message = `${products.length} products found.`;
            
            return sendResponse({res, success: true, statusCode: 200, message: message, data: products});
        }else{
            message = 'No products registred!'
            sendResponse({res, success: true, statusCode: 404, message: message});
        }

    } catch (err) {
        
        let errorMessage = 'An unknown error occurred';
        if (err instanceof Error) {
            errorMessage = err.message;
        }

        message = 'Error when trying to list all products.';
        
        sendResponse({
            res, 
            success: false, 
            statusCode: 500, 
            message: message, 
            error: errorMessage
        });
    }
}

async function getProductId(req: Request, res: Response): Promise<void> {

    let message;
    const {
        id
    } = req.params;
    try {

        const product = await getProductById(Number(id));

        if(product) {
            message = `Product ID: ${id} found.`;
            sendResponse({
                res, 
                success: true,
                statusCode: 200,
                message: message,
                data: product
            });
        }else {
            message = `Product ID: ${id} not found.`;
            sendResponse({
                res, 
                success: true,
                statusCode: 404,
                message: message
            });
        }
        
    } catch (err) {
        
        let errorMessage = 'An unknown error occurred';
        if(err instanceof Error) {
            errorMessage = err.message;
        }

        message = 'Error when trying to list ny ID.';

        sendResponse({
            res,
            success: false,
            statusCode: 500,
            message: message,
            error: errorMessage
        });

    }

}

async function productCreate(req:Request, res:Response) {
    
    let message;
    const {
        data
    } = req.body;

    try {

        await createProduct(data);

        message = `Product: ${data.nm_product} registred successfully!`;
        sendResponse({
            res,
            success: true,
            statusCode: 201,
            message: message 
        })
        
    } catch (err) {
        
        let errorMessage = 'An unknown error occurred';
        let errorCode:string | undefined;

        if(err instanceof Error){
            errorMessage = err.message;

            if('code' in err){
                errorCode = (err as any).code;
            }
        }

        if(errorCode === 'ER_DUP_ENTRY') {
            message = 'Duplication error when registering the product.';
            sendResponse({
                res,
                success: false,
                statusCode: 500,
                message: message,
                error: errorMessage
            })
        }else{
            message = 'Error when trying to list create Product.';

            sendResponse({
                res,
                success: true,
                statusCode: 500,
                message: message,
                error: errorMessage
            })
        }

    }

}

async function getProductCode(req:Request, res:Response) {
    
    let message;
    const {
        code
    } = req.params;

    try {

        if(code.length == 0 || code == null){
            message = "It is necessary to enter a value other than null.";
            sendResponse({
                res,
                success: true,
                statusCode: 422,
                message: message
            })
        }

        const product = await getProductByCode(code);

        if(product){
            message = `Product Code: ${code} found.`;
            sendResponse({
                res,
                success: true,
                statusCode: 200,
                message: message,
                data: product
            });
        }else{
            message = `Product Code: '${code}' not found!`;
            sendResponse({
                res,
                success: true,
                statusCode: 404,
                message: message
            })
        }

        
    } catch (err) {
        let errorMessage = 'An unknown error occurred';

        if(err instanceof Error){
            errorMessage = err.message;
        }
  
        message = 'Error when trying to list to Code Product.';

        sendResponse({
            res,
            success: true,
            statusCode: 500,
            message: message,
            error: errorMessage
        })
        

    }

}

async function productUpdate(req: Request, res: Response) {

    let message;
    const {
        data
    } = req.body;

    const {id} = req.params;

    try {

        const product = await getProductById(Number(id));

        if(product) {
            await updateProduct(Number(id), data);

            message = `Product ID: ${id} updated.`;
            sendResponse({
                res,
                success: true,
                statusCode: 200,
                message: message
            })
        }else {
            message = `Product ID: ${id} not found.`;
            sendResponse({
                res, 
                success: true,
                statusCode: 404,
                message: message
            });
        }

        
        
    } catch (err) {
        let errorMessage = 'An unknown error occurred';
        let errorCode:string | undefined;

        console.error(err)

        if(err instanceof Error){
            errorMessage = err.message;
            if('code' in err){
                errorCode = (err as any).code;
            }
        }

        if(errorCode === 'ER_DUP_ENTRY') {
            message = 'Duplication error when registering the product.';
            sendResponse({
                res,
                success: false,
                statusCode: 500,
                message: message,
                error: errorMessage
            })
        }else{
            message = 'Error when trying to list update Product.';

            sendResponse({
                res,
                success: true,
                statusCode: 500,
                message: message,
                error: errorMessage
            })
        }
    }

}

export { getProducts, getProductId, productCreate, getProductCode, productUpdate };