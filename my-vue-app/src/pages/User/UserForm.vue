<template>
  <div class="p-4">
    <h1 v-if="user && user.cccdId" class="text-xl font-bold mb-4">
      Cập nhật thông tin người dùng
    </h1>
    <h1 v-else class="text-xl font-bold mb-4">Thêm mới người dùng</h1>
    <form @submit.prevent="handleSave">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Cột trái -->
        <div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Họ và tên</label>
            <input
              v-model="form.fullName"
              type="text"
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              :class="{ 'border-red-500': v$.fullName.$error }"
              @blur="v$.fullName.$touch()"
            />
            <span v-if="v$.fullName.$error" class="text-red-500 text-sm">
              {{
                v$.fullName.required.$invalid
                  ? "Vui lòng nhập họ và tên"
                  : "Họ và tên phải có ít nhất 2 ký tự"
              }}
            </span>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Số điện thoại</label>
            <input
              v-model="form.phoneNumber"
              type="tel"
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              :class="{ 'border-red-500': v$.phoneNumber.$error }"
              @blur="v$.phoneNumber.$touch()"
            />
            <span v-if="v$.phoneNumber.$error" class="text-red-500 text-sm">
              {{
                v$.phoneNumber.required.$invalid
                  ? "Vui lòng nhập số điện thoại"
                  : "Số điện thoại không hợp lệ"
              }}
            </span>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Tên đăng nhập</label>
            <input
              v-model="form.username"
              type="text"
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              :class="{ 'border-red-500': v$.username.$error }"
              @blur="v$.username.$touch()"
            />
            <span v-if="v$.username.$error" class="text-red-500 text-sm">
              {{
                v$.username.required.$invalid
                  ? "Vui lòng nhập tên đăng nhập"
                  : "Tên đăng nhập phải có ít nhất 4 ký tự"
              }}
            </span>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Giới tính</label>
            <div class="flex items-center mt-1 space-x-4">
              <label class="flex items-center">
                <input type="radio" v-model="form.gender" :value="1" class="form-radio" />
                <span class="ml-2">Nam</span>
              </label>
              <label class="flex items-center">
                <input type="radio" v-model="form.gender" :value="2" class="form-radio" />
                <span class="ml-2">Nữ</span>
              </label>
            </div>
            <span v-if="v$.gender.$error" class="text-red-500 text-sm">
              Vui lòng chọn giới tính
            </span>
          </div>
        </div>

        <!-- Cột phải -->
        <div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">CCCD</label>
            <input
              v-model="form.cccdId"
              type="text"
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              :class="{ 'border-red-500': v$.cccdId.$error }"
              @blur="v$.cccdId.$touch()"
            />
            <span v-if="v$.cccdId.$error" class="text-red-500 text-sm">
              {{
                v$.cccdId.required.$invalid
                  ? "Vui lòng nhập CCCD"
                  : "CCCD phải là 12 chữ số"
              }}
            </span>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Địa chỉ</label>
            <input
              v-model="form.address"
              type="text"
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input
              v-model="form.email"
              type="email"
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              :class="{ 'border-red-500': v$.email.$error }"
              @blur="v$.email.$touch()"
            />
            <span v-if="v$.email.$error" class="text-red-500 text-sm">
              {{
                v$.email.required.$invalid
                  ? "Vui lòng nhập email"
                  : "Email không hợp lệ"
              }}
            </span>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Vai trò</label>
            <select
              v-model="form.userRoleId"
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            >
              <option :value="1">Quản trị hệ thống</option>
              <option :value="3">Nhân viên nội bộ</option>
              <option :value="4">Khách</option>
            </select>
          </div>

          <!-- avatar -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Ảnh đại diện</label>
            <input
              type="file"
              id="avatar"
              accept="image/*"
              @change="handleFileChange"
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            />
            <span v-if="avatarError" class="text-red-500 text-sm">{{ avatarError }}</span>
            <div v-if="form.avatarPreview" class="mt-2">
              <img
                :src="form.avatarPreview"
                alt="Ảnh xem trước"
                class="w-32 h-32 object-cover rounded-lg border border-gray-300"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-end mt-4 gap-4">
        <Button
          label="Hủy"
          class="p-button-outlined p-button-rounded p-button-lg px-6 py-3 text-gray-600 border-gray-400 transition-all duration-200 hover:bg-gray-200 hover:border-gray-500"
          @click="$emit('close')"
        />
        <Button
          label="Lưu"
          type="submit"
          class="p-button-success p-button-rounded p-button-lg px-6 py-3 transition-all duration-200 bg-green-500 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="v$.$invalid"
        />
      </div>
    </form>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, email, helpers } from '@vuelidate/validators';
import Button from 'primevue/button';

const phoneValid = helpers.regex(/^(0[3|5|7|8|9])+([0-9]{8})$/);
const cccdValid = helpers.regex(/^\d{12}$/);

export default {
  components: { Button },
  props: {
    user: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { emit }) {
    const form = ref({
      cccdId: '',
      username: '',
      fullName: '',
      gender: 1,
      phoneNumber: '',
      address: '',
      email: '',
      userRoleId: 1,
      avatar: null, // File ảnh mới
      avatarPreview: null, // URL xem trước
      existingImageBlob: null // Dữ liệu nhị phân của ảnh hiện tại
    });

    const avatarError = ref('');

    const rules = {
      fullName: { required, minLength: minLength(2) },
      phoneNumber: { required, phoneValid },
      username: { required, minLength: minLength(4) },
      cccdId: { required, cccdValid },
      email: { required, email },
      gender: { required }
    };

    const v$ = useVuelidate(rules, form);

    // Tải ảnh hiện tại từ imageUrl và lưu dưới dạng Blob
    const loadExistingImage = async (imageUrl) => {
      if (imageUrl) {
        try {
          const response = await fetch(imageUrl, { mode: 'cors' });
          if (!response.ok) throw new Error('Không thể tải ảnh hiện tại');
          const blob = await response.blob();
          form.value.existingImageBlob = blob;
          form.value.avatarPreview = imageUrl; // Giữ URL cho xem trước
        } catch (error) {
          console.error('Lỗi khi tải ảnh hiện tại:', error);
          avatarError.value = 'Không thể tải ảnh hiện tại';
          form.value.existingImageBlob = null;
          form.value.avatarPreview = null;
        }
      } else {
        form.value.existingImageBlob = null;
        form.value.avatarPreview = null;
      }
    };

    watch(() => props.user, (newUser) => {
      if (newUser) {
        form.value = {
          ...newUser,
          avatar: null,
          avatarPreview: newUser.imageUrl || null,
          existingImageBlob: null
        };
        // Tải ảnh hiện tại nếu có imageUrl
        loadExistingImage(newUser.imageUrl);
      } else {
        form.value = {
          cccdId: '',
          username: '',
          fullName: '',
          gender: 1,
          phoneNumber: '',
          address: '',
          email: '',
          userRoleId: 1,
          avatar: null,
          avatarPreview: null,
          existingImageBlob: null
        };
      }
    }, { immediate: true });

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        if (!file.type.startsWith('image/')) {
          avatarError.value = 'Vui lòng chọn file ảnh hợp lệ';
          form.value.avatar = null;
          form.value.avatarPreview = null;
          form.value.existingImageBlob = null;
        } else if (file.size > 5 * 1024 * 1024) { // Giới hạn 5MB
          avatarError.value = 'Ảnh không được vượt quá 5MB';
          form.value.avatar = null;
          form.value.avatarPreview = null;
          form.value.existingImageBlob = null;
        } else {
          form.value.avatar = file;
          avatarError.value = '';
          form.value.avatarPreview = URL.createObjectURL(file);
          form.value.existingImageBlob = null; // Xóa Blob cũ vì chọn ảnh mới
        }
      } else {
        // Khôi phục ảnh hiện tại
        form.value.avatar = null;
        form.value.avatarPreview = props.user.imageUrl || null;
        loadExistingImage(props.user.imageUrl);
      }
    };

    const handleSave = () => {
      v$.value.$touch();
      if (!v$.value.$invalid) {
        const formData = new FormData();
        formData.append('cccdId', form.value.cccdId);
        formData.append('username', form.value.username);
        formData.append('fullName', form.value.fullName);
        formData.append('gender', form.value.gender);
        formData.append('phoneNumber', form.value.phoneNumber);
        formData.append('address', form.value.address || '');
        formData.append('email', form.value.email);
        formData.append('userRoleId', form.value.userRoleId);

        if (form.value.avatar) {
          // Gửi file ảnh mới
          formData.append('imageUrl', form.value.avatar, 'avatar.jpg');
        } else if (form.value.existingImageBlob) {

          formData.append('imageUrl', form.value.existingImageBlob, 'existing-avatar.jpg');
        }

        // Debug: In formData
        console.log([...formData.entries()]);

        emit('save', formData);
      }
    };

    const cleanup = () => {
      if (form.value.avatarPreview) {
        URL.revokeObjectURL(form.value.avatarPreview);
      }
    };

    return {
      form,
      v$,
      avatarError,
      handleFileChange,
      handleSave,
      cleanup
    };
  },
  beforeUnmount() {
    this.cleanup();
  }
};
</script>