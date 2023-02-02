<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-loading-bar-provider>
      <n-message-provider>
        <n-notification-provider>
          <n-dialog-provider>
            <router-view></router-view>
          </n-dialog-provider>
        </n-notification-provider>
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script>
import { defineComponent } from "vue";
import { NConfigProvider } from "naive-ui";

const themeOverrides = {
  common: {
    fontSizeSmall: "11px",
    fontSizeMedium: "11px",
    fontSizeLarge: "11px",
    fontSizeHuge: "11px",
    titleFontSize: "8px",
  },
};

export default defineComponent({
  data() {
    return {
      themeOverrides: themeOverrides,
    };
  },
});
</script>
