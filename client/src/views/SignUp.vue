<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from "vue";
import { useVuelidate } from "@vuelidate/core";
import {
  required,
  email,
  helpers,
  alpha,
  minLength,
} from "@vuelidate/validators";
import { RouteNames } from "@/router";
import useAuth from "@/store/useAuth";
import Input from "@/components/Input.vue";

let { signUp } = useAuth();

let formState = reactive({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirm: "",
});

let showPassword = ref(false);

let rules = {
  firstName: {
    required: helpers.withMessage("Please enter first name", required),
    alpha: helpers.withMessage(
      "Firsrt name should contains alphabets only",
      alpha
    ),
    minLength: helpers.withMessage(
      "First name should contains atleast 3 characters",
      minLength(3)
    ),
  },
  lastName: {
    required: helpers.withMessage("Please enter last name", required),
    alpha: helpers.withMessage(
      "Last name should contains alphabets only",
      alpha
    ),
    minLength: helpers.withMessage(
      "Last name should contains atleast 3 characters",
      minLength(3)
    ),
  },
  email: {
    required: helpers.withMessage("Please enter email", required),
    email: helpers.withMessage("Invalid email", email),
  },
  password: {
    required: helpers.withMessage("Please enter password", required),
    pattern: helpers.withMessage("Pattern mistach", (val: string) =>
      /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(val)
    ),
  },
  confirm: {
    required: helpers.withMessage("Please enter confirm password", required),
    sameAs: helpers.withMessage(
      "Confirm password is not match with password",
      (val) => val === formState.password
    ),
  },
};

const $v = useVuelidate(rules, formState);

onMounted(() => {
  document.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeyDown);
});

let handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Enter") handleSubmit();
};

let handleSubmit = async () => {
  let isValid = await $v.value.$validate();

  if (!isValid) return;

  let { firstName, lastName, ...rest } = formState;

  let data = {
    name: `${firstName} ${lastName}`,
    ...rest,
  };

  signUp(data);
};
</script>

<template>
  <div :class="styles.container">
    <div>
      <div :class="styles.logo">
        <span>Create your Account</span>
      </div>
      <div :class="styles.form">
        <div :class="styles.wrap_field">
          <Input
            label="First name"
            v-model="formState.firstName"
            :error="$v.firstName.$error"
            :error-message="$v.firstName.$errors[0]?.$message"
          />
          <Input
            label="Last name"
            v-model="formState.lastName"
            :error="$v.lastName.$error"
            :error-message="$v.lastName.$errors[0]?.$message"
          />
        </div>
        <Input
          label="Email Id"
          v-model="formState.email"
          :error="$v.email.$error"
          :error-message="$v.email.$errors?.[0]?.$message"
        />
        <div :class="styles.password_field">
          <div :class="styles.wrap_field">
            <Input
              label="Password"
              :type="showPassword ? 'text' : 'password'"
              v-model="formState.password"
              :error="$v.password.$error"
              :error-message="$v.password.$errors[0]?.$message"
            />
            <Input
              label="Confirm"
              :type="showPassword ? 'text' : 'password'"
              v-model="formState.confirm"
              :error="$v.confirm.$error"
              :error-message="$v.confirm.$errors[0]?.$message"
            />
          </div>
          <span :class="styles.password_note"
            >Use 8 or more characters with a mix of letters, numbers, uppercase
            & symbols</span
          >
          <div :class="styles.show_field">
            <input
              id="show-password"
              type="checkbox"
              v-model="showPassword"
              :checked="showPassword"
            />
            <label for="show-password">Show password</label>
          </div>
        </div>
        <div :class="styles.cta">
          <router-link :to="{ name: RouteNames.signIn }">
            Sign in instead
          </router-link>
          <button @click="handleSubmit">Create Account</button>
        </div>
      </div>
    </div>
    <div :class="styles.poster">
      <img :src="`${$publicPath}images/account.svg`" />
    </div>
  </div>
</template>

<style lang="scss" module="styles">
.container {
  display: grid;
  grid-template-columns: 0.6fr 0.4fr;
  gap: 15px;
  background-color: #fff;
  border: 1px solid #dadce0;
  border-radius: 8px;
  width: 100%;
  max-width: 768px;
  padding: 30px;
  margin: 30px 0px;
  .logo {
    display: flex;
    flex-direction: column;
    gap: 15px;
    span {
      color: #202124;
      font-size: 24px;
    }
  }
  .form {
    display: flex;
    flex-direction: column;
    gap: 30px;
    margin-top: 30px;
    .wrap_field {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
    }
    .password_field {
      display: flex;
      flex-direction: column;
      gap: 10px;
      .password_note {
        color: #5f6368;
        font-size: 14px;
      }
      .show_field {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 10px;
        input {
          accent-color: #1a73e8;
          width: 15px;
          height: 15px;
          cursor: pointer;
        }
        label {
          color: #202124;
          font-size: 14px;
          cursor: pointer;
        }
      }
    }
    .cta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 15px;
      margin-top: 40px;
      a {
        color: #1a73e8;
        font-size: 14px;
        font-family: "Poppins-Medium", sans-serif;
      }
      button {
        background-color: #1a73e8;
        color: white;
        width: 150px;
        height: 36px;
        font-family: "Poppins-Medium", sans-serif;
        border: none;
        border-radius: 4px;
      }
    }
  }
  .poster {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 15px;
    img {
      display: block;
      margin: 0px auto;
      max-width: 100%;
      height: auto;
      object-fit: contain;
    }
  }
}
</style>
