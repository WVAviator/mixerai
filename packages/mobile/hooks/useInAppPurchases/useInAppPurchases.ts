import React from 'react';
import * as InAppPurchases from 'expo-in-app-purchases';
import { Platform } from 'react-native';
import serverInstance from '../../utilities/serverInstance';

const verifyPurchase = (purchase: InAppPurchases.InAppPurchase) => {
  try {
    serverInstance.post('/tokens/purchase', purchase);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const useSetupInAppPurchases = () => {
  React.useEffect(() => {
    const setupInAppPurchases = async () => {
      InAppPurchases.connectAsync();

      InAppPurchases.setPurchaseListener(
        ({ responseCode, results, errorCode }) => {
          if (responseCode === InAppPurchases.IAPResponseCode.OK) {
            if (!results) {
              return;
            }
            results.forEach((purchase) => {
              if (!purchase.acknowledged) {
                console.log(`Successfully purchased ${purchase.productId}`);
                const verified = verifyPurchase(purchase);
                if (verified) {
                  InAppPurchases.finishTransactionAsync(purchase, false);
                }
              }
            });
          } else if (
            responseCode === InAppPurchases.IAPResponseCode.USER_CANCELED
          ) {
            console.log('User canceled the transaction');
          } else if (responseCode === InAppPurchases.IAPResponseCode.DEFERRED) {
            console.log(
              'User does not have permissions to buy but requested parental approval (iOS only)',
            );
          } else {
            console.warn(
              `Something went wrong with the purchase. Received errorCode ${errorCode}`,
            );
          }
        },
      );
    };

    setupInAppPurchases();

    return () => {
      InAppPurchases.disconnectAsync();
    };
  }, []);
};

export const useInAppPurchases = () => {
  const [items, setItems] = React.useState<InAppPurchases.IAPItemDetails[]>([]);

  React.useEffect(() => {
    const getProducts = async () => {
      try {
        const items = Platform.select({
          ios: ['com.mixerai.tokens_10', 'com.mixerai.tokens_25'],
          android: ['com.mixerai.tokens_10', 'com.mixerai.tokens_25'],
        });

        if (!items) {
          throw new Error('Items is null');
        }

        const { responseCode, results } = await InAppPurchases.getProductsAsync(
          items,
        );
        if (results && responseCode === InAppPurchases.IAPResponseCode.OK) {
          setItems(results);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getProducts();
  }, []);

  const purchaseItem = async (item: InAppPurchases.IAPItemDetails) => {
    try {
      await InAppPurchases.purchaseItemAsync(item.productId);
    } catch (error) {
      console.log(error);
    }
  };

  return { items, purchaseItem };
};
