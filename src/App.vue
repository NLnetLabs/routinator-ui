<template>
  <div id="app">
    <el-container>
      <el-header>
        <el-row>
          <el-col :span="4">
            <router-link :to="{ name: 'home' }" custom v-slot="{ navigate }">
              <div
                class="logo"
                @click="navigate"
                @keypress.enter="navigate"
                role="link"
              >
                <img src="@/assets/images/routinator_logo_white.svg" />
              </div>
            </router-link>
          </el-col>
          <el-col :span="18"
            ><el-menu
              :router="true"
              :default-active="activeIndex"
              mode="horizontal"
              background-color="#001f6d"
              text-color="#fff"
              active-text-color="#ffffff"
            >
              <el-menu-item index="0" :route="{ name: 'home' }">
                Prefix Check
              </el-menu-item>
              <el-menu-item index="1" :route="{ name: 'metrics' }">
                Metrics
              </el-menu-item>
              <el-menu-item index="2" :route="{ name: 'repositories' }">
                Repositories
              </el-menu-item>
              <el-menu-item index="3" :route="{ name: 'connections' }">
                Connections
              </el-menu-item>
            </el-menu>
            &nbsp;</el-col
          >
          <el-col :span="2">
            <el-menu
              mode="horizontal"
              background-color="#001f6d"
              text-color="#fff"
              active-text-color="#ffffff"
              default-active=""
            >
              <el-menu-item @click="showHelp = true" class="help-menu">
                <i class="el-icon-help"></i>
              </el-menu-item>
            </el-menu>
          </el-col>
        </el-row>
      </el-header>

      <el-main>
        <router-view v-on:update-version="updateVersion" />
      </el-main>

      <el-footer height="40px">
        <el-row>
          <el-col :span="12">
            &copy; {{ new Date().getFullYear() }} Stichting NLnet Labs
            <span v-if="version"
              >- {{ $t("common.version") }} {{ version }}</span
            ><span> - ui/{{ uiVersion }}</span>
          </el-col>
          <el-col :span="12" class="text-right">
            <a
              href="https://nlnetlabs.nl/services/contracts/"
              target="_blank"
              >{{ $t("common.supportcontracts") }}</a
            >
            -
            <a href="https://routinator.docs.nlnetlabs.nl/" target="_blank">{{
              $t("common.readthedocs")
            }}</a>
            -
            <a
              href="https://github.com/NLnetLabs/routinator/issues/new"
              target="_blank"
              >{{ $t("common.report") }}</a
            >
          </el-col>
        </el-row>
      </el-footer>
    </el-container>
    <el-drawer
      title="Routinator Help"
      :visible.sync="showHelp"
      :with-header="false"
    >
      <div class="help">
        <h3>Quick Help</h3>
        <div>
          In addition to various metrics, the most prominent functionality is
          the Prefix Check, which provides the RPKI validity of Autonomous
          System and IP prefix combinations.
          <br /><br /> By default, you only need to provide an IP address or
          prefix. When clicking "Validate", Routinator will look up from
          which Autonomous System the closest matching prefix is announced in
          BGP and perform RPKI validation. Alternatively, you can manually
          provide an ASN.
          <br /><br /> The returned RPKI validity state will be <em>Valid</em>,
          <em>Invalid</em> or <em>Not Found</em> and is based on the current
          set of Validated ROA Payloads (VRPs) in the cache. Routinator will
          provide an overview of all VRPs that led to the result, along with
          the reason for the outcome.
          <br /><br /> Routinator doesn’t just retrieve the ASN for a specific
          prefix, but it also fetches related information. In addition to
          validating the longest matching prefix (or exact match if this is
          what you selected), details can be provided on less specific and
          more specific announcements seen in BGP, as well as other resources
          allocated to the same organisation.
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import "@fontsource/fira-code/variable.css";
import "@fontsource/raleway/variable.css";

export default {
  data() {
    return {
      showHelp: false,
      version: "",
      activeIndex: "0",
      uiVersion: `${process.env.PACKAGE_VERSION}${process.env.NODE_ENV === 'development' && '+dev' || ''}`
    };
  },
  watch: {
    $route(to) {
      this.activeIndex = this.getActiveIndex(to.name);
    }
  },
  mounted: function() {
    this.activeIndex = this.getActiveIndex(this.$route.name);
  },
  methods: {
    getActiveIndex(path) {
      return (
        "" + (["metrics", "repositories", "connections"].indexOf(path) + 1)
      );
    },
    updateVersion(version) {
      this.version = version;
    }
  }
};
</script>

<style lang="scss">
html,
body {
  padding: 0;
  margin: 0;
  font-family: Raleway, sans-serif;
  font-size: 1rem;
  background-color: #ffffff;
  font-style: normal;
  font-weight: 500;
}

.mono {
  font-family: "Fira CodeVariable", monospace;
  font-weight: 500;
}

.sans-serif {
  font-family: Raleway, sans-serif;
  font-size: 1rem;
  font-weight: 500;
}

.el-container {
  min-height: 100vh;
}

.el-header {
  background: linear-gradient(45deg, #001f6d, #001f6d);
  color: #ffffff;
  z-index: 3;
}

.el-menu-item a {
  text-decoration: none;
}

.logo {
  cursor: pointer;
  line-height: 10px;
  img {
    width: 180px;
    margin-top: 12px;
  }
}

.toolbar,
.text-right {
  text-align: right;
}

.help-menu {
  float: right !important;
  i {
    color: #ffffff !important;
  }
}

.el-footer {
  z-index: 100;
  background-color: #fafafa;
  color: #999;
  font-size: 13px;
  line-height: 40px;
  a,
  a:hover {
    color: #999;
    font-weight: 600;
    text-decoration: none;
  }
}

.valign-top {
  vertical-align: top !important;
}

.el-drawer__body {
  overflow-y: auto;
}

.help {
  font-size: 0.9rem;
  line-height: 1.4rem;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-bottom: 1rem;
  color: #666;
  h3 {
    margin-bottom: 0.5rem;
  }
  h4 {
    margin-bottom: 0.4rem;
    font-weight: 400;
    color: #999;
  }
}

a {
  color: #001f6d;
  &:hover {
    color: #000028;
  }
}
</style>
