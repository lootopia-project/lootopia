import User from '#models/user'
import i18nManager from '@adonisjs/i18n/services/main'
import fcmToken from '../type/fcm_token.js'
import axios from 'axios'
import admin from '#services/firebase_admin'


export const sendNotification=async (fcmToken: fcmToken,verifyCredentials:User,title:string,body:string) => {
    const i18n = i18nManager.locale(verifyCredentials.lang)

    try {
        if (fcmToken.platform === 'Mobile') {
          // Envoi via Expo pour les appareils mobiles
          const expoPushToken = fcmToken.token

          if (!expoPushToken.startsWith('ExponentPushToken')) {
            throw new Error('Le token Expo Push fourni est invalide.')
          }

          const message = {
            to: expoPushToken,
            title: i18n.t('_.'+title),
            body: i18n.t('_.'+body, {
              name: verifyCredentials.name,
            }),
          }

          const expoResponse = await axios.post(
            'https://exp.host/--/api/v2/push/send',
            message,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )

          expoResponse.data
        } else if (fcmToken.platform === 'Web') {
          const message = {
            notification: {
              title: i18n.t('_.'+title),
              body: i18n.t('_.'+body),
            },
            token: fcmToken.token,
          }

          await admin.messaging().send(message)
        }
      } catch (error) {
        console.error("Erreur lors de l'envoi de la notification :", error.message || error)
      }

    }