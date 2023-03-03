<script setup lang="ts">
import { ref, reactive } from "vue";
import useAuth from "@/store/useAuth";
import { useVuelidate } from "@vuelidate/core";
import { required, email, helpers } from "@vuelidate/validators";
import { RouteNames } from "@/router";
import Input from "@/components/Input.vue";

let formState = reactive({
  email: "",
  password: "",
});

let { signIn } = useAuth();

let showPassword = ref(false);

let rules = {
  email: {
    required: helpers.withMessage("Please enter email", required),
    email: helpers.withMessage("Invalid email", email),
  },
  password: {
    required: helpers.withMessage("Please enter password", required),
  },
};

const $v = useVuelidate(rules, formState);

let handleSubmit = async () => {
  let isValid = await $v.value.$validate();
  if (!isValid) return;
  signIn(formState);
};
</script>

<template>
  <div :class="styles.container">
    <div :class="styles.wrapper">
      <div>
        <div :class="styles.logo">
          <span>Sign In</span>
          <span>to continue to Gmail</span>
        </div>
        <div :class="styles.form">
          <Input
            label="Email Id"
            v-model="formState.email"
            :error="$v.email.$error"
            :error-message="$v.email.$errors?.[0]?.$message"
          />
          <Input
            label="Password"
            :type="showPassword ? 'text' : 'password'"
            v-model="formState.password"
            :error="$v.password.$error"
            :error-message="$v.password.$errors[0]?.$message"
          />
          <div :class="styles.cta">
            <router-link :to="{ name: RouteNames.signUp }"
              >Create Account</router-link
            >
            <button @click="handleSubmit">Sign in</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module="styles">
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  .wrapper {
    background-color: #fff;
    border: 1px solid #dadce0;
    border-radius: 8px;
    width: 100%;
    max-width: 420px;
    padding: 30px;
    margin: 30px 0px;
    .logo {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;
      span {
        color: #202124;
        font-size: 24px;
        &:last-child {
          font-size: 16px;
        }
      }
    }
    .form {
      display: flex;
      flex-direction: column;
      gap: 30px;
      margin-top: 30px;
      input {
        height: 46px;
      }
      .cta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 15px;
        margin-top: 20px;
        a {
          color: #1a73e8;
          font-size: 14px;
          font-family: "Poppins-Medium", sans-serif;
        }
        button {
          background-color: #1a73e8;
          color: white;
          width: 90px;
          height: 36px;
          font-family: "Poppins-Medium", sans-serif;
          border: none;
          border-radius: 4px;
        }
      }
    }
  }
}
</style>
