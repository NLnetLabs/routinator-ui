<template>
  <div id="app">
    <el-container>
      <el-header>
        <el-row>
          <el-col :span="4">
            <router-link :to="{ name: 'home' }">
              <div class="logo">
                <img src="@/assets/images/routinator_logo_white.svg" />
              </div>
            </router-link>
          </el-col>
          <el-col :span="18"> &nbsp;</el-col>
          <el-col :span="2">
            <el-menu
              mode="horizontal"
              background-color="#000028"
              text-color="#fff"
              active-text-color="#fff"
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
            <span v-if="version">- Version {{ version }}</span>
          </el-col>
          <el-col :span="12" class="text-right">
            <a href="https://nlnetlabs.nl/services/contracts/" target="_blank">{{
              $t("common.supportcontracts")
            }}</a>
            -
            <a href="https://rpki.readthedocs.io/en/latest/routinator/index.html" target="_blank">{{
              $t("common.readthedocs")
            }}</a>
            -
            <a href="https://github.com/NLnetLabs/routinator/issues/new" target="_blank">{{
              $t("common.report")
            }}</a>
          </el-col>
        </el-row>
      </el-footer>
    </el-container>
    <el-drawer title="Routinator Help" :visible.sync="showHelp" :with-header="false">
      <div class="help">
        <h3>Introduction</h3>
        <div>
          This page displays statistics from the last validation run Routinator has performed.
          <br /><br />
          You can also use this page to verify the RPKI origin validation status of an AS Number and
          IP Prefix combination. You can enter an existing BGP announcement or an ASN and prefix of
          your choice, for example for an announcement you're planning to do.<br /><br />
          The returned RPKI validity state will be Valid, Invalid or Not Found and is based on the
          current set of Validated ROA Payloads (VRPs) in the cache. Routinator will provide an
          overview of all VRPs that led to the result, along with the reason for the outcome.
        </div>
        <h3>Quick Glossary</h3>
        <div>
          This overview provides a quick definition of the terms used in this user interface. For a
          complete overview, please refer to the
          <a href="https://rpki.readthedocs.io/en/latest/routinator/" target="_blank"
            >Routinator documentation</a
          >.
          <h4>Route Origin Attestation (ROA)</h4>
          A cryptographically signed statement authorising one or more prefixes to be originated
          from a specific Autonomous System.
          <h4>Validated ROA Payload (VRP)</h4>
          A verified object that contains a single IP prefix, a maximum prefix length, and an origin
          AS number. When comparing the total set of VRPs to a BGP announcement, it can be RPKI
          Valid, Invalid or NotFound.
          <h4>Unsafe VRP</h4>
          VRPs that have IP address prefixes overlapping with resources of rejected Certificate
          Authorities (CAs)
          <h4>Stale Object</h4>
          An object is considered stale if the time given in their 'next-update' field is in the
          past, indicating that an update to the object was scheduled but didn’t happen.
          <h4>RPKI Repository Delta Protocol (RRDP)</h4>
          A retrieval mechanism that relies on snapshot and delta files which are retrieved using
          HTTPS. It is designed to replace the original transport used for RPKI, rsync.
          <h4>RPKI to Router (RTR) Protocol</h4>
          A protocol to deliver VRPs to a router in a lightweight manner.
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showHelp: false,
      version: ""
    };
  },
  methods: {
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
  font-family: "Lato", sans-serif;
  background-color: #fff;
}

.el-container {
  min-height: 100vh;
}

.el-header {
  background: linear-gradient(45deg, #001f6d, #000028);
  color: #ffffff;
  z-index: 3;
}

.el-menu-item a {
  text-decoration: none;
}

.logo {
  line-height: 10px;
  img {
    width: 180px;
    margin-top: 12px;
  }
}

.logout {
  margin-left: 2rem;
  cursor: pointer;
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
    font-weight: bold;
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
