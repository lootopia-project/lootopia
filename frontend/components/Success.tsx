import { View, Text, Modal, TouchableOpacity } from 'react-native';
import SUCCESS from '@/type/feature/success/success';

const Success = ({ visible, onClose, successMessage }: SUCCESS) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center bg-black bg-opacity-50 px-4">
                <View className="w-full max-w-md p-6 bg-white rounded-lg items-center">
                    <Text className="text-green-500 text-lg mb-6 text-center">
                        {successMessage || "Operation completed successfully."}
                    </Text>
                    <TouchableOpacity className="w-full px-6 py-3 bg-green-600 rounded-lg" onPress={onClose}>
                        <Text className="text-white text-lg text-center">OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default Success;
