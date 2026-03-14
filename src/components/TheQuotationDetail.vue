<template>
  <div class="page-container d-flex flex-column">
    <div
      class="px-4 py-3 px-md-6 py-md-4 border-bottom d-flex flex-wrap align-center justify-space-between bg-white flex-shrink-0 sticky-top shadow-sm sticky-header"
      style="z-index: 900; min-height: 80px; top: 0"
    >
      <div>
        <div class="d-flex flex-wrap align-center gap-2 mb-1">
          <h2 class="text-h5 font-weight-bold text-grey-darken-3 mb-0">
            {{
              isNew
                ? "สร้างเอกสารใหม่"
                : `เลขที่: ${
                    formData.quotationDocId ||
                    formData.deliveryDocId ||
                    formData.receiptDocId ||
                    "N/A"
                  }`
            }}
          </h2>
          <v-chip
            v-if="!isNew"
            :color="getStatusColor(formData.docStatus)"
            class="font-weight-bold text-white ms-2"
            size="small"
            variant="flat"
          >
            {{ formData.docStatus }}
          </v-chip>
        </div>
        <div class="text-body-2 text-grey">
          {{
            isNew
              ? "กรอกรายละเอียดเพื่อสร้างเอกสาร"
              : "จัดการรายละเอียดและสถานะเอกสาร"
          }}
        </div>
      </div>

      <div class="d-flex flex-wrap align-center mt-3 mt-md-0" style="gap: 12px">
        <v-menu v-model="menu" location="bottom end">
          <template v-slot:activator="{ props }">
            <v-btn
              color="#107C41"
              variant="flat"
              prepend-icon="mdi-microsoft-excel"
              append-icon="mdi-chevron-down"
              class="text-capitalize font-weight-bold px-4 text-white"
              rounded="pill"
              v-bind="props"
              :loading="isExporting"
              :disabled="isSaving || formData.docStatus === 'ยกเลิก'"
            >
              {{ isExporting ? "กำลังสร้าง..." : "Export Excel" }}
            </v-btn>
          </template>
          <v-list density="compact" class="py-0 rounded-lg elevation-2">
            <v-list-item
              @click="downloadIndividual('QUOTATION')"
              :disabled="isExporting"
              class="hover-bg"
            >
              <template v-slot:prepend>
                <v-icon
                  icon="mdi-file-document-outline"
                  size="small"
                  class="mr-2 text-grey-darken-1"
                ></v-icon>
              </template>
              <v-list-item-title class="text-body-2"
                >ใบเสนอราคา</v-list-item-title
              >
            </v-list-item>

            <v-list-item
              @click="downloadIndividual('DELIVERY_NOTE')"
              :disabled="isExporting || !formData.deliveryDocId"
              class="hover-bg"
            >
              <template v-slot:prepend>
                <v-icon
                  icon="mdi-truck-delivery-outline"
                  size="small"
                  class="mr-2 text-grey-darken-1"
                ></v-icon>
              </template>
              <v-list-item-title class="text-body-2"
                >ใบส่งของ</v-list-item-title
              >
            </v-list-item>

            <v-list-item
              @click="downloadIndividual('RECEIPT')"
              :disabled="isExporting || !formData.receiptDocId"
              class="hover-bg"
            >
              <template v-slot:prepend>
                <v-icon
                  icon="mdi-receipt-text-check-outline"
                  size="small"
                  class="mr-2 text-grey-darken-1"
                ></v-icon>
              </template>
              <v-list-item-title class="text-body-2"
                >ใบเสร็จรับเงิน</v-list-item-title
              >
            </v-list-item>

            <v-divider class="my-0"></v-divider>

            <v-list-item
              @click="downloadAll"
              :disabled="isExporting"
              class="bg-grey-lighten-4 hover-bg"
            >
              <template v-slot:prepend>
                <v-icon
                  icon="mdi-folder-zip-outline"
                  size="small"
                  class="mr-2 text-primary"
                ></v-icon>
              </template>
              <v-list-item-title
                class="text-body-2 font-weight-bold text-primary"
                >ดาวน์โหลดทั้งหมด (ZIP)</v-list-item-title
              >
            </v-list-item>
          </v-list>
        </v-menu>

        <v-btn
          variant="outlined"
          color="grey-darken-1"
          prepend-icon="mdi-arrow-left"
          class="text-capitalize font-weight-bold"
          rounded="pill"
          @click="$router.go(-1)"
        >
          ย้อนกลับ
        </v-btn>
      </div>
    </div>

    <div
      class="flex-grow-1 overflow-y-auto px-3 py-4 px-md-6 pb-16 mb-5 bg-light-gray w-100"
    >
      <div
        v-if="loading"
        class="d-flex justify-content-center align-items-center"
        style="height: 50vh"
      >
        <div class="spinner-border text-theme" role="status"></div>
      </div>
      <div v-else class="mx-auto" style="max-width: 100%">
        <v-form ref="quotationForm" v-model="formValid">
          <div
            class="bg-white rounded-lg pa-3 pa-md-5 mb-4 section-block"
            v-if="!isNew"
          >
            <div class="d-flex align-center mb-3 mb-md-4">
              <v-icon
                icon="mdi-timeline-text-outline"
                color="primary"
                class="mr-2"
              ></v-icon>
              <h5 class="fw-bold m-0 text-dark text-subtitle-1 text-md-h6">
                สถานะเอกสาร
              </h5>
            </div>

            <div class="w-100 overflow-x-auto py-2 mb-4 px-2 no-scrollbar">
              <div
                class="d-flex align-center justify-md-center mx-auto"
                style="min-width: 600px; max-width: 800px"
              >
                <div
                  class="text-center position-relative"
                  style="z-index: 2; width: 100px"
                >
                  <v-avatar
                    :color="getStepColor(1)"
                    size="40"
                    class="mb-2 border elevation-1 transition-swing"
                  >
                    <v-icon
                      icon="mdi-file-document-outline"
                      color="white"
                      size="20"
                    ></v-icon>
                  </v-avatar>
                  <div class="text-caption font-weight-bold text-no-wrap mt-1">
                    ใบเสนอราคา
                  </div>
                </div>

                <v-divider
                  :color="getStepColor(2, true)"
                  class="border-opacity-100 mx-2 flex-grow-1 mb-5"
                  thickness="3"
                  rounded
                ></v-divider>

                <div
                  class="text-center position-relative"
                  style="z-index: 2; width: 100px"
                >
                  <v-avatar
                    :color="getStepColor(2)"
                    size="40"
                    class="mb-2 border elevation-1 transition-swing"
                  >
                    <v-icon
                      icon="mdi-truck-delivery-outline"
                      color="white"
                      size="20"
                    ></v-icon>
                  </v-avatar>
                  <div class="text-caption font-weight-bold text-no-wrap mt-1">
                    ใบส่งของ
                  </div>
                </div>

                <v-divider
                  :color="getStepColor(3, true)"
                  class="border-opacity-100 mx-2 flex-grow-1 mb-5"
                  thickness="3"
                  rounded
                ></v-divider>

                <div
                  class="text-center position-relative"
                  style="z-index: 2; width: 100px"
                >
                  <v-avatar
                    :color="getStepColor(3)"
                    size="40"
                    class="mb-2 border elevation-1 transition-swing"
                  >
                    <v-icon
                      icon="mdi-receipt-text-check-outline"
                      color="white"
                      size="20"
                    ></v-icon>
                  </v-avatar>
                  <div class="text-caption font-weight-bold text-no-wrap mt-1">
                    ใบเสร็จรับเงิน
                  </div>
                </div>
              </div>
            </div>

            <div
              class="mt-2 p-3 bg-grey-lighten-5 rounded-lg border border-dashed d-flex flex-column flex-md-row align-start align-md-center gap-3"
            >
              <span
                class="font-weight-bold text-grey-darken-3 text-no-wrap mb-1 mb-md-0 text-body-2"
              >
                <v-icon icon="mdi-update" class="mr-1" size="small"></v-icon>
                เปลี่ยนสถานะ:
              </span>
              <v-select
                v-model="formData.docStatus"
                :items="statusOptions"
                variant="outlined"
                density="compact"
                bg-color="white"
                color="primary"
                hide-details
                class="w-100 flex-grow-1"
                style="max-width: 100%; width: 100%"
                @update:model-value="onStatusChange"
              ></v-select>
              <v-expand-transition>
                <div
                  v-if="statusChanged"
                  class="d-flex align-center px-3 py-1 bg-red-lighten-5 text-red rounded-pill align-self-start align-self-md-center"
                >
                  <v-icon
                    icon="mdi-alert-circle"
                    size="small"
                    class="mr-1"
                  ></v-icon>
                  <span class="text-caption font-weight-bold"
                    >กรุณากดบันทึก</span
                  >
                </div>
              </v-expand-transition>
            </div>
          </div>

          <div
            class="bg-white rounded-lg pa-3 pa-md-5 mb-4 section-block w-100"
          >
            <div class="d-flex align-items-center mb-4 border-bottom pb-2">
              <div class="section-number me-3">1</div>
              <h5 class="fw-bold m-0 text-dark text-subtitle-1 text-md-h6">
                ข้อมูลเอกสาร
              </h5>
            </div>

            <div class="row g-3 mx-0">
              <template v-if="formData.docStatus === 'ออกใบเสนอราคา'">
                <div class="col-12 col-md-4">
                  <div
                    class="text-subtitle-2 text-md-subtitle-1 font-weight-bold mb-1"
                  >
                    เลขที่ใบเสนอราคา
                  </div>
                  <v-text-field
                    v-model="formData.quotationDocId"
                    placeholder="เช่น QT-2026-001"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                  ></v-text-field>
                </div>
                <div class="col-12 col-md-4">
                  <div
                    class="text-subtitle-2 text-md-subtitle-1 font-weight-bold mb-1"
                  >
                    วันที่ออกใบเสนอราคา
                  </div>
                  <v-text-field
                    id="issue-date"
                    v-model="formData.issueDate"
                    placeholder="dd/mm/yyyy"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                    prepend-inner-icon="mdi-calendar-blank"
                    readonly
                  ></v-text-field>
                </div>
                <div class="col-12 col-md-6">
                  <div
                    class="text-subtitle-2 text-md-subtitle-1 font-weight-bold mb-1"
                  >
                    พนักงานขาย
                  </div>
                  <v-text-field
                    v-model="formData.salesman"
                    placeholder="ระบุชื่อ-นามสกุล"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                  ></v-text-field>
                </div>
                <div class="col-12 col-md-6">
                  <div
                    class="text-subtitle-2 text-md-subtitle-1 font-weight-bold mb-1"
                  >
                    ยืนยันราคาภายใน (วัน)
                  </div>
                  <v-text-field
                    v-model="formData.priceValidityDays"
                    placeholder="เช่น 30"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                    type="number"
                    prepend-inner-icon="mdi-clock-time-four-outline"
                  ></v-text-field>
                </div>
              </template>

              <template v-else-if="formData.docStatus === 'ออกใบส่งของ'">
                <div class="col-12 col-md-4">
                  <div
                    class="text-subtitle-2 text-md-subtitle-1 font-weight-bold mb-1"
                  >
                    เลขที่ใบส่งของ
                  </div>
                  <v-text-field
                    v-model="formData.deliveryDocId"
                    placeholder="เช่น DN-2026-001"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                  ></v-text-field>
                </div>
                <div class="col-12 col-md-4">
                  <div
                    class="text-subtitle-2 text-md-subtitle-1 font-weight-bold mb-1"
                  >
                    วันที่ออกใบส่งของ
                  </div>
                  <v-text-field
                    id="delivery-date"
                    v-model="formData.deliveryDate"
                    placeholder="dd/mm/yyyy"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                    prepend-inner-icon="mdi-calendar-check"
                    readonly
                  ></v-text-field>
                </div>
                <div class="col-12 col-md-6">
                  <div
                    class="text-subtitle-2 text-md-subtitle-1 font-weight-bold mb-1"
                  >
                    กำหนดชำระเงิน (เครดิต)
                  </div>
                  <v-text-field
                    v-model="formData.paymentTerm"
                    placeholder="เช่น 30 วัน, เงินสด"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                  ></v-text-field>
                </div>
                <div class="col-12 col-md-6">
                  <div
                    class="text-subtitle-2 text-md-subtitle-1 font-weight-bold mb-1"
                  >
                    ครบกำหนด
                  </div>
                  <v-text-field
                    id="due-date"
                    v-model="formData.dueDate"
                    placeholder="dd/mm/yyyy"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                    prepend-inner-icon="mdi-calendar-clock"
                    readonly
                  ></v-text-field>
                </div>
              </template>

              <template v-else-if="formData.docStatus === 'ออกใบเสร็จรับเงิน'">
                <div class="col-12 col-md-4">
                  <div
                    class="text-subtitle-2 text-md-subtitle-1 font-weight-bold mb-1"
                  >
                    เลขที่ใบเสร็จรับเงิน
                  </div>
                  <v-text-field
                    v-model="formData.receiptDocId"
                    placeholder="เช่น RC-2026-001"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                  ></v-text-field>
                </div>
                <div class="col-12 col-md-4">
                  <div
                    class="text-subtitle-2 text-md-subtitle-1 font-weight-bold mb-1"
                  >
                    วันที่ออกใบเสร็จ
                  </div>
                  <v-text-field
                    id="issue-date"
                    v-model="formData.issueDate"
                    placeholder="dd/mm/yyyy"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                    prepend-inner-icon="mdi-calendar-blank"
                    readonly
                  ></v-text-field>
                </div>
              </template>
            </div>
          </div>

          <div
            class="bg-white rounded-lg pa-3 pa-md-5 mb-4 section-block w-100"
          >
            <div class="d-flex align-items-center mb-4 border-bottom pb-2">
              <div class="section-number me-3">2</div>
              <h5 class="fw-bold m-0 text-dark text-subtitle-1 text-md-h6">
                ข้อมูลลูกค้า
              </h5>
            </div>

            <div class="row g-3 mx-0">
              <div class="col-12 col-md-4">
                <div
                  class="text-subtitle-2 text-md-subtitle-1 font-weight-bold mb-1"
                >
                  ชื่อลูกค้า/บริษัท
                </div>
                <v-combobox
                  v-model="formData.customerName"
                  v-model:search="customerSearchText"
                  :items="customerSuggestions"
                  item-title="customerName"
                  item-value="customerName"
                  :no-filter="true"
                  :loading="isCustomerSuggestLoading"
                  :hide-no-data="(customerSearchText || '').length < 1"
                  no-data-text="ไม่พบข้อมูลลูกค้า"
                  placeholder="ระบุชื่อบริษัทหรือลูกค้า"
                  persistent-placeholder
                  variant="outlined"
                  density="comfortable"
                  clearable
                  autocomplete="off"
                  hide-details
                  @update:search="onCustomerSearchInput"
                  @update:model-value="onCustomerNameSelected"
                  @click:clear="onCustomerCleared"
                ></v-combobox>
              </div>
              <div class="col-12 col-md-4">
                <div
                  class="text-subtitle-2 text-md-subtitle-1 font-weight-bold mb-1"
                >
                  เลขประจำตัวผู้เสียภาษี
                </div>
                <v-text-field
                  v-model="formData.customerTaxId"
                  placeholder="เลข 13 หลัก"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  maxlength="13"
                ></v-text-field>
              </div>
              <div class="col-12 col-md-4">
                <div
                  class="text-subtitle-2 text-md-subtitle-1 font-weight-bold mb-1"
                >
                  เบอร์โทรศัพท์
                </div>
                <v-text-field
                  v-model="formData.customerPhone"
                  placeholder="เช่น 08x-xxx-xxxx"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  type="tel"
                  maxlength="10"
                  :rules="[rules.phone]"
                  @input="filterPhone"
                ></v-text-field>
              </div>
              <div class="col-12">
                <div
                  class="text-subtitle-2 text-md-subtitle-1 font-weight-bold mb-1"
                >
                  ที่อยู่
                </div>
                <v-textarea
                  v-model="formData.customerAddress"
                  placeholder="ระบุที่อยู่สำหรับออกเอกสาร"
                  variant="outlined"
                  density="comfortable"
                  rows="2"
                  auto-grow
                  hide-details
                ></v-textarea>
              </div>
            </div>
          </div>

          <div
            v-if="formData.docStatus !== 'ยกเลิก'"
            class="bg-white rounded-lg pa-3 pa-md-5 mb-4 section-block w-100"
          >
            <div class="d-flex align-items-center mb-4 border-bottom pb-2">
              <div class="section-number me-3">3</div>
              <h5 class="fw-bold m-0 text-dark text-subtitle-1 text-md-h6">
                รายละเอียดสินค้า
              </h5>
            </div>

            <v-tabs
              v-model="activeTab"
              color="primary"
              class="mb-4 product-tabs"
              show-arrows
              align-tabs="start"
              density="compact"
            >
              <v-tab
                v-for="(section, index) in formData.productSections"
                :key="index"
                :value="index"
                class="text-body-2 font-weight-bold letter-spacing-normal rounded-t-lg mx-1"
              >
                {{ section.name || `กลุ่ม ${index + 1}` }}
              </v-tab>
              <v-tab
                value="add-section"
                class="text-body-2 font-weight-bold letter-spacing-normal rounded-t-lg mx-1 text-grey-darken-1 border-dashed-tab"
              >
                <v-icon icon="mdi-plus" size="small" class="me-1"></v-icon>
                เพิ่มกลุ่ม
              </v-tab>
            </v-tabs>

            <v-window
              v-model="activeTab"
              class="bg-grey-lighten-5 rounded-lg border px-2 py-3 px-md-3"
            >
              <v-window-item
                v-for="(section, sectionIndex) in formData.productSections"
                :key="sectionIndex"
                :value="sectionIndex"
              >
                <div
                  class="d-flex flex-column flex-md-row align-items-md-start justify-content-between mb-4 p-3 bg-white rounded-lg shadow-sm border-0"
                >
                  <div class="flex-grow-1 mb-2 mb-md-0 w-100 me-md-4">
                    <div
                      class="text-subtitle-2 text-md-subtitle-1 font-weight-bold mb-1 text-dark"
                    >
                      ชื่อกลุ่มรายการ <span class="text-red">*</span>
                    </div>
                    <v-text-field
                      v-model="section.name"
                      placeholder="เช่น งานติดตั้ง, อะไหล่"
                      variant="outlined"
                      density="compact"
                      bg-color="white"
                      hide-details="auto"
                      :rules="[(v) => !!v || 'กรุณาระบุชื่อกลุ่มรายการ']"
                    ></v-text-field>
                  </div>
                  <div
                    class="d-flex gap-2 align-self-end align-self-md-start mt-2 mt-md-8 w-100 w-md-auto justify-end"
                  >
                    <v-btn
                      color="#4D2FB2"
                      size="small"
                      prepend-icon="mdi-plus"
                      @click="addItemToSection(sectionIndex)"
                      variant="flat"
                      class="px-4 flex-grow-1 flex-md-grow-0"
                      height="40"
                      >เพิ่มรายการ</v-btn
                    >
                    <v-btn
                      icon="mdi-delete-outline"
                      size="small"
                      variant="text"
                      color="error"
                      class="opacity-75 bg-red-lighten-5 rounded"
                      @click="removeProductSection(sectionIndex)"
                      height="40"
                      width="40"
                    ></v-btn>
                  </div>
                </div>

                <div
                  v-if="section.items.length === 0"
                  class="text-center py-8 py-md-10 text-dark bg-white rounded-lg border border-dashed"
                >
                  <v-icon
                    icon="mdi-cart-plus"
                    size="48"
                    color="grey-lighten-2"
                    class="mb-2"
                  ></v-icon>
                  <p class="mb-2 text-body-2">ยังไม่มีรายการสินค้าในกลุ่มนี้</p>
                  <v-btn
                    variant="text"
                    color="#4D2FB2"
                    @click="addItemToSection(sectionIndex)"
                    >+ เพิ่มรายการแรก</v-btn
                  >
                </div>

                <div
                  v-else
                  class="table-responsive bg-white rounded-lg border mb-4"
                  style="
                    overflow-x: auto;
                    width: 100%;
                    -webkit-overflow-scrolling: touch;
                  "
                >
                  <table
                    class="table table-hover align-middle mb-0 custom-table mobile-scroll-table"
                  >
                    <thead class="bg-grey-lighten-4">
                      <tr>
                        <th
                          class="text-center py-3 text-dark text-no-wrap"
                          style="width: 50px"
                        >
                          #
                        </th>
                        <th
                          class="py-3 text-dark text-no-wrap"
                          style="min-width: 250px"
                        >
                          รายละเอียด
                        </th>
                        <th
                          class="text-center py-3 text-dark text-no-wrap"
                          style="min-width: 80px"
                        >
                          จำนวน
                        </th>
                        <th
                          class="text-center py-3 text-dark text-no-wrap"
                          style="min-width: 100px"
                        >
                          หน่วย
                        </th>
                        <th
                          class="text-end py-3 text-dark text-no-wrap"
                          style="min-width: 120px"
                        >
                          ราคา/หน่วย
                        </th>
                        <th
                          class="text-end py-3 text-dark text-no-wrap"
                          style="min-width: 120px"
                        >
                          รวม
                        </th>
                        <th style="width: 50px"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(item, itemIndex) in section.items"
                        :key="itemIndex"
                      >
                        <td class="text-center text-grey">
                          {{ itemIndex + 1 }}
                        </td>
                        <td>
                          <v-textarea
                            v-model="item.description"
                            placeholder="รายละเอียด"
                            variant="outlined"
                            density="compact"
                            hide-details
                            rows="1"
                            auto-grow
                            class="my-1"
                          ></v-textarea>
                        </td>
                        <td>
                          <v-text-field
                            v-model.number="item.quantity"
                            type="number"
                            variant="outlined"
                            density="compact"
                            hide-details
                            class="centered-input my-1"
                            @input="calculateItemTotal(sectionIndex, itemIndex)"
                          ></v-text-field>
                        </td>
                        <td>
                          <v-select
                            v-model="item.unit"
                            :items="unitOptions"
                            variant="outlined"
                            density="compact"
                            hide-details
                            class="centered-input my-1"
                          ></v-select>
                        </td>
                        <td>
                          <v-text-field
                            v-model.number="item.unitPrice"
                            type="number"
                            variant="outlined"
                            density="compact"
                            hide-details
                            class="text-right-input my-1"
                            @input="calculateItemTotal(sectionIndex, itemIndex)"
                          ></v-text-field>
                        </td>
                        <td class="text-end font-weight-bold text-dark">
                          {{ formatCurrency(item.total) }}
                        </td>
                        <td class="text-center">
                          <v-btn
                            icon="mdi-trash-can-outline"
                            size="x-small"
                            variant="text"
                            color="grey"
                            class="hover-red"
                            @click="
                              removeItemFromSection(sectionIndex, itemIndex)
                            "
                          ></v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div class="d-flex justify-content-end mt-4">
                  <div class="col-12 col-md-5 col-lg-4 px-0 px-md-3">
                    <div
                      class="bg-white rounded-lg p-3 p-md-4 shadow-sm border summary-card"
                    >
                      <div class="d-flex align-center mb-3">
                        <v-icon
                          icon="mdi-calculator"
                          color="primary"
                          class="mr-2"
                          size="small"
                        ></v-icon>
                        <span
                          class="text-subtitle-2 font-weight-bold text-dark text-truncate"
                          >สรุปยอด:
                          <span class="text-dark">{{
                            section.name || `กลุ่ม ${sectionIndex + 1}`
                          }}</span></span
                        >
                      </div>
                      <div
                        class="d-flex justify-content-between align-items-center mb-2"
                      >
                        <span class="text-body-1 text-dark">รวมเป็นเงิน</span>
                        <span class="text-body-1 font-weight-bold">{{
                          formatCurrency(calculateSectionTotal(sectionIndex))
                        }}</span>
                      </div>
                      <div
                        class="d-flex justify-content-between align-items-center mb-3"
                      >
                        <span class="text-body-2 text-dark">VAT 7%</span>
                        <span class="text-body-1 font-weight-bold text-dark">{{
                          formatCurrency(calculateSectionVAT(sectionIndex))
                        }}</span>
                      </div>
                      <v-divider class="mb-3"></v-divider>
                      <div
                        class="d-flex justify-content-between align-items-center"
                      >
                        <span class="text-subtitle-1 font-weight-bold text-dark"
                          >ยอดรวมสุทธิ</span
                        >
                        <span class="text-h6 font-weight-bold text-dark">{{
                          formatCurrency(
                            calculateSectionGrandTotal(sectionIndex)
                          )
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </v-window-item>

              <v-window-item value="add-section">
                <div
                  class="text-center py-8 py-md-12 bg-white rounded-lg border border-dashed"
                >
                  <v-avatar color="grey-lighten-4" size="64" class="mb-3"
                    ><v-icon
                      icon="mdi-folder-plus-outline"
                      size="32"
                      color="primary"
                    ></v-icon
                  ></v-avatar>
                  <h6 class="text-subtitle-1 text-md-h6 mb-2 text-dark">
                    เพิ่มกลุ่มรายการใหม่
                  </h6>
                  <v-btn
                    color="#4D2FB2"
                    size="large"
                    rounded="pill"
                    prepend-icon="mdi-plus"
                    @click="addProductSectionAndSwitch"
                    elevation="2"
                    >สร้างกลุ่มใหม่</v-btn
                  >
                </div>
              </v-window-item>
            </v-window>
          </div>

          <div
            v-if="formData.docStatus === 'ออกใบเสร็จรับเงิน'"
            class="bg-white rounded-lg pa-3 pa-md-5 mb-4 section-block w-100"
          >
            <div class="d-flex align-items-center mb-4 border-bottom pb-2">
              <div class="section-number me-3">4</div>
              <h5 class="fw-bold m-0 text-dark text-subtitle-1 text-md-h6">
                ข้อมูลการชำระเงิน
              </h5>
            </div>
            <div class="row g-3 mx-0">
              <div class="col-12">
                <div
                  class="text-subtitle-2 text-md-subtitle-1 font-weight-bold mb-2"
                >
                  ชำระโดย
                </div>
                <v-radio-group
                  v-model="formData.paymentMethod"
                  inline
                  hide-details
                  class="mt-n2"
                >
                  <v-radio
                    label="เงินสด"
                    value="เงินสด"
                    color="primary"
                    class="mr-4"
                  ></v-radio>
                  <v-radio
                    label="เช็คธนาคาร"
                    value="เช็คธนาคาร"
                    color="primary"
                  ></v-radio>
                </v-radio-group>
              </div>
              <template v-if="formData.paymentMethod === 'เช็คธนาคาร'">
                <div class="col-12 col-md-6">
                  <div
                    class="text-subtitle-2 text-md-subtitle-1 font-weight-bold mb-1"
                  >
                    ธนาคาร
                  </div>
                  <v-text-field
                    v-model="formData.chequeBank"
                    placeholder="ระบุชื่อธนาคาร"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                  ></v-text-field>
                </div>
                <div class="col-12 col-md-6">
                  <div
                    class="text-subtitle-2 text-md-subtitle-1 font-weight-bold mb-1"
                  >
                    สาขา
                  </div>
                  <v-text-field
                    v-model="formData.chequeBranch"
                    placeholder="ระบุสาขา"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                  ></v-text-field>
                </div>
                <div class="col-12 col-md-4">
                  <div
                    class="text-subtitle-2 text-md-subtitle-1 font-weight-bold mb-1"
                  >
                    เช็คเลขที่
                  </div>
                  <v-text-field
                    v-model="formData.chequeNo"
                    placeholder="ระบุเลขที่เช็ค"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                  ></v-text-field>
                </div>
                <div class="col-12 col-md-4">
                  <div
                    class="text-subtitle-2 text-md-subtitle-1 font-weight-bold mb-1"
                  >
                    ลงวันที่
                  </div>
                  <v-text-field
                    id="cheque-date"
                    v-model="formData.chequeDate"
                    placeholder="dd/mm/yyyy"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                    prepend-inner-icon="mdi-calendar-range"
                    readonly
                  ></v-text-field>
                </div>
                <div class="col-12 col-md-4">
                  <div
                    class="text-subtitle-2 text-md-subtitle-1 font-weight-bold mb-1"
                  >
                    จำนวนเงิน
                  </div>
                  <v-text-field
                    v-model="formData.chequeAmount"
                    placeholder="0.00"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                    type="number"
                  ></v-text-field>
                </div>
              </template>
            </div>
          </div>

          <div
            class="bg-white rounded-lg pa-3 pa-md-5 mb-4 section-block w-100"
            v-if="formData.docStatus !== 'ยกเลิก'"
          >
            <div class="d-flex align-items-center mb-4 border-bottom pb-2">
              <div class="section-number me-3">
                {{ formData.docStatus === "ออกใบเสร็จรับเงิน" ? 5 : 4 }}
              </div>
              <h5 class="fw-bold m-0 text-dark text-subtitle-1 text-md-h6">
                ลงนาม
              </h5>
            </div>

            <div
              class="row g-3 mx-0"
              v-if="formData.docStatus === 'ออกใบเสนอราคา'"
            >
              <div class="col-12 col-md-4">
                <div
                  class="text-subtitle-2 text-md-subtitle-1 font-weight-bold mb-1"
                >
                  ผู้เสนอราคา
                </div>
                <v-text-field
                  v-model="formData.offererName"
                  placeholder="ลงชื่อผู้เสนอราคา"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                ></v-text-field>
              </div>
            </div>

            <div v-else-if="formData.docStatus === 'ออกใบส่งของ'">
              <div class="row g-3 mx-0">
                <div class="col-12 col-md-6 border-end-md">
                  <div class="row g-3 mx-0">
                    <div class="col-12 col-md-8">
                      <div
                        class="text-subtitle-2 text-md-subtitle-1 font-weight-bold mb-1"
                      >
                        ผู้รับของ
                      </div>
                      <v-text-field
                        v-model="formData.receiverName"
                        placeholder="ลงชื่อผู้รับของ"
                        variant="outlined"
                        density="comfortable"
                        hide-details
                      ></v-text-field>
                    </div>
                    <div class="col-12 col-md-4">
                      <div
                        class="text-subtitle-2 text-md-subtitle-1 font-weight-bold mb-1"
                      >
                        วันที่รับ
                      </div>
                      <v-text-field
                        id="received-date"
                        v-model="formData.receivedDate"
                        placeholder="dd/mm/yyyy"
                        variant="outlined"
                        density="comfortable"
                        hide-details
                        prepend-inner-icon="mdi-calendar-check"
                        readonly
                      ></v-text-field>
                    </div>
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="row g-3 mx-0">
                    <div class="col-12 col-md-8">
                      <div
                        class="text-subtitle-2 text-md-subtitle-1 font-weight-bold mb-1"
                      >
                        ผู้ส่งของ
                      </div>
                      <v-text-field
                        v-model="formData.senderName"
                        placeholder="ลงชื่อผู้ส่งของ"
                        variant="outlined"
                        density="comfortable"
                        hide-details
                      ></v-text-field>
                    </div>
                    <div class="col-12 col-md-4">
                      <div
                        class="text-subtitle-2 text-md-subtitle-1 font-weight-bold mb-1"
                      >
                        วันที่ส่ง
                      </div>
                      <v-text-field
                        id="sent-date"
                        v-model="formData.sentDate"
                        placeholder="dd/mm/yyyy"
                        variant="outlined"
                        density="comfortable"
                        hide-details
                        prepend-inner-icon="mdi-calendar-check"
                        readonly
                      ></v-text-field>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row g-3 mx-0 mt-1">
                <div class="col-12 col-md-4">
                  <div
                    class="text-subtitle-2 text-md-subtitle-1 font-weight-bold mb-1"
                  >
                    ผู้มีอำนาจลงนาม
                  </div>
                  <v-text-field
                    v-model="formData.authorizedSigner"
                    placeholder="ลงชื่อผู้มีอำนาจ"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                  ></v-text-field>
                </div>
              </div>
            </div>

            <div v-else-if="formData.docStatus === 'ออกใบเสร็จรับเงิน'">
              <div class="row g-3 mx-0">
                <div class="col-12 col-md-4">
                  <div
                    class="text-subtitle-2 text-md-subtitle-1 font-weight-bold mb-1"
                  >
                    ได้รับสินค้าตามรายการถูกต้องแล้ว
                  </div>
                  <v-text-field
                    id="received-date"
                    v-model="formData.receivedDate"
                    placeholder="DATE: dd/mm/yyyy"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                    prepend-inner-icon="mdi-calendar-check"
                    readonly
                  ></v-text-field>
                </div>
                <div class="col-12 col-md-4">
                  <div
                    class="text-subtitle-2 text-md-subtitle-1 font-weight-bold mb-1"
                  >
                    ผู้รับเงิน
                  </div>
                  <v-text-field
                    v-model="formData.receiverOfMoney"
                    placeholder="ลงชื่อผู้รับเงิน"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                  ></v-text-field>
                </div>
                <div class="col-12 col-md-4">
                  <div
                    class="text-subtitle-2 text-md-subtitle-1 font-weight-bold mb-1"
                  >
                    วันที่รับเงิน
                  </div>
                  <v-text-field
                    id="money-received-date"
                    v-model="formData.dateOfReceivingMoney"
                    placeholder="dd/mm/yyyy"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                    prepend-inner-icon="mdi-calendar-check"
                    readonly
                  ></v-text-field>
                </div>
                <div class="col-12 col-md-4">
                  <div
                    class="text-subtitle-2 text-md-subtitle-1 font-weight-bold mb-1"
                  >
                    ผู้มีอำนาจลงนาม
                  </div>
                  <v-text-field
                    v-model="formData.authorizedSigner"
                    placeholder="ลงชื่อผู้มีอำนาจ"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                  ></v-text-field>
                </div>
              </div>
            </div>
          </div>
        </v-form>
      </div>
    </div>

    <div
      class="bg-white border-top py-2 px-3 py-md-3 px-md-6 d-flex align-items-center justify-content-between justify-content-md-end fixed-bottom-custom shadow-lg"
      style="z-index: 1040"
    >
      <div class="d-flex flex-column d-md-none">
        <template v-if="isDirty">
          <span
            class="text-caption text-danger font-weight-bold d-flex align-center"
          >
            <v-icon
              icon="mdi-alert-circle"
              size="x-small"
              class="me-1"
            ></v-icon>
            รอการบันทึก
          </span>
        </template>
        <template v-else>
          <span class="text-caption text-grey d-flex align-center">
            <v-icon
              icon="mdi-information-outline"
              size="x-small"
              class="me-1"
            ></v-icon>
            พร้อมบันทึก
          </span>
        </template>
      </div>

      <div class="me-auto d-none d-md-flex align-center text-grey-darken-1">
        <template v-if="isDirty">
          <v-icon
            icon="mdi-alert-circle"
            size="small"
            class="me-2 text-danger"
          ></v-icon>
          <span class="text-caption text-danger font-weight-bold">
            มีการแก้ไขข้อมูล อย่าลืมบันทึก!
          </span>
        </template>
        <template v-else>
          <v-icon
            icon="mdi-information-outline"
            size="small"
            class="me-2"
          ></v-icon>
          <span class="text-caption">ตรวจสอบความถูกต้องก่อนบันทึก</span>
        </template>
      </div>

      <button
        class="btn btn-primary px-4 px-md-5 py-2 rounded-pill d-flex align-items-center gap-2 shadow-sm btn-save-custom ms-auto ms-md-0"
        @click="saveForm"
        :disabled="isSaving"
        style="background-color: #4d2fb2; border: none"
      >
        <span
          v-if="isSaving"
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span>
        <v-icon v-else icon="mdi-content-save-outline" class="me-1"></v-icon>
        <span class="fw-bold">{{ isSaving ? "บันทึก" : "บันทึกข้อมูล" }}</span>
      </button>
    </div>
  </div>
</template>

<script>
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { Thai } from "flatpickr/dist/l10n/th.js";
import apiClient from "@/services/authService";
import Swal from "sweetalert2";
import { swalTheme } from "@/utils/swalTheme";
import { saveAs } from "file-saver";
import XlsxPopulate from "xlsx-populate/browser/xlsx-populate";
import JSZip from "jszip";

function createDefaultData() {
  return {
    quotationDocId: "",
    docStatus: "ออกใบเสนอราคา",
    issueDate: "",
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    customerTaxId: "",
    salesman: "",
    priceValidityDays: "",
    validUntil: "",
    paymentTerm: "",
    dueDate: "",
    deliveryDocId: "",
    receiptDocId: "",
    chequeBank: "",
    chequeBranch: "",
    chequeNo: "",
    chequeDate: "",
    chequeAmount: "",
    receiverOfMoney: "",
    dateOfReceivingMoney: "",
    receiverName: "",
    receivedDate: "",
    senderName: "",
    sentDate: "",
    authorizedSigner: "",
    estimateNote: "",
    deliveryDate: "",
    deliveryAddress: "",
    paymentDate: "",
    paymentMethod: "เงินสด",
    amountPaid: "",
    receivedBy: "",
    remark: "",
    offererName: "",
    productSections: [],
  };
}

export default {
  name: "TheQuotationDetail",
  props: { id: { type: String, default: "new" } },
  data() {
    return {
      loading: false,
      formValid: false,
      isSaving: false,
      isExporting: false,
      menu: false,
      isDirty: false,
      originalFormData: null, // เก็บค่าเริ่มต้น
      statusOptions: [
        "ออกใบเสนอราคา",
        "ออกใบส่งของ",
        "ออกใบเสร็จรับเงิน",
        "ยกเลิก",
      ],
      unitOptions: [
        "ชิ้น",
        "แพ็ค",
        "กล่อง",
        "หน่วย",
        "ชุด",
        "ชั่วโมง",
        "วัน",
        "เดือน",
      ],
      formData: createDefaultData(),
      customerSearchText: "",
      customerSuggestions: [],
      isCustomerSuggestLoading: false,
      customerSuggestTimer: null,
      previousStatus: "ออกใบเสนอราคา",
      statusChanged: false,
      activeTab: 0,
      pickers: {},
      rules: {
        phone: (v) =>
          !v || /^0[0-9]{9}$/.test(v) || "เบอร์โทรต้องเป็นตัวเลข 10 หลัก",
      },
    };
  },
  computed: {
    isNew() {
      return this.id === "new";
    },
  },
  watch: {
    formData: {
      handler(newVal) {
        if (this.originalFormData) {
          const currentData = JSON.stringify(newVal);
          this.isDirty = currentData !== this.originalFormData;
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.customerSearchText = "";
    this.customerSuggestions = [];
    if (!this.isNew) this.fetchDocument();
    this.previousStatus = this.formData.docStatus;
    this.$nextTick(() => {
      this.initDatePickers();
    });
  },
  beforeUnmount() {
    Object.values(this.pickers).forEach((fp) => fp && fp.destroy());
    if (this.customerSuggestTimer) {
      clearTimeout(this.customerSuggestTimer);
      this.customerSuggestTimer = null;
    }
  },

  beforeRouteLeave(to, from, next) {
    if (this.isDirty) {
      Swal.fire({
        title: "มีการแก้ไขข้อมูลค้างอยู่",
        text: "คุณต้องการออกจากหน้านี้โดยไม่บันทึกหรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "ออกจากหน้านี้",
        cancelButtonText: "ยกเลิก",
        ...swalTheme.danger,
      }).then((result) => {
        if (result.isConfirmed) {
          next();
        } else {
          next(false);
        }
      });
    } else {
      next();
    }
  },

  methods: {
    resetCustomerDetailFields() {
      this.formData.customerTaxId = "";
      this.formData.customerPhone = "";
      this.formData.customerAddress = "";
    },

    onCustomerCleared() {
      this.formData.customerName = "";
      this.customerSearchText = "";
      this.customerSuggestions = [];
      this.resetCustomerDetailFields();
    },

    onCustomerSearchInput(value) {
      this.customerSearchText = value || "";

      if (this.customerSuggestTimer) {
        clearTimeout(this.customerSuggestTimer);
      }

      const keyword = (value || "").trim();
      if (keyword.length < 1) {
        this.customerSuggestions = [];
        return;
      }

      this.customerSuggestTimer = setTimeout(() => {
        this.fetchCustomerSuggestions(keyword);
      }, 350);
    },

    onCustomerNameSelected(selectedName) {
      if (!selectedName) {
        this.onCustomerCleared();
        return;
      }

      const pickedName =
        typeof selectedName === "string"
          ? selectedName
          : selectedName?.customerName || "";
      if (!pickedName) {
        this.onCustomerCleared();
        return;
      }

      const selected = this.customerSuggestions.find(
        (item) => (item.customerName || "").toLowerCase() === pickedName.toLowerCase()
      );
      if (!selected) return;

      this.formData.customerName = selected.customerName || pickedName;
      this.formData.customerTaxId = selected.customerTaxId || "";
      this.formData.customerPhone = selected.customerPhone || "";
      this.formData.customerAddress = selected.customerAddress || "";
    },

    async fetchCustomerSuggestions(keyword) {
      this.isCustomerSuggestLoading = true;
      try {
        const response = await apiClient.get("/quotation/customers/suggest", {
          params: {
            q: keyword,
            limit: 10,
          },
        });

        const payload = response?.data;
        const rows = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload?.rows)
          ? payload.rows
          : Array.isArray(payload?.result)
          ? payload.result
          : [];

        this.customerSuggestions = rows
          .map((item) => ({
            customerName: item?.customerName || item?.customer_name || "",
            customerTaxId: item?.customerTaxId || item?.customer_tax_id || "",
            customerPhone: item?.customerPhone || item?.customer_phone || "",
            customerAddress: item?.customerAddress || item?.customer_address || "",
          }))
          .filter((item) => item.customerName)
          .map((item) => ({
            customerName: item.customerName,
            customerTaxId: item.customerTaxId || "",
            customerPhone: item.customerPhone || "",
            customerAddress: item.customerAddress || "",
          }));
      } catch (error) {
        console.error("Customer suggest error:", error);
        this.customerSuggestions = [];
      } finally {
        this.isCustomerSuggestLoading = false;
      }
    },

    // --------------------------------------------------------------------------------
    // ส่วนฟังก์ชันส่งออกไฟล์ Excel โดยใช้ XlsxPopulate + JSZip
    // --------------------------------------------------------------------------------

    // 1. ฟังก์ชันสร้าง Workbook ตามประเภทเอกสาร
    async generateWorkbook(docType) {
      let templateFile = "";
      let sheetPrefix = "";

      if (docType === "QUOTATION") {
        templateFile = "/templates/quotation.xlsx";
      } else if (docType === "DELIVERY_NOTE") {
        templateFile = "/templates/delivery.xlsx";
        sheetPrefix = "ใบส่งของ_ใบกำกับภาษี_";
      } else if (docType === "RECEIPT") {
        templateFile = "/templates/receipt.xlsx";
        sheetPrefix = "ใบเสร็จรับเงิน_";
      } else {
        throw new Error("Invalid Document Type");
      }

      // ดึงไฟล์ Template (.xlsx)
      const response = await fetch(templateFile);
      if (!response.ok)
        throw new Error(
          `ไม่พบไฟล์ต้นฉบับ: ${templateFile} โปรดเช็คใน public/templates/`
        );
      const arrayBuffer = await response.arrayBuffer();

      // อ่านไฟล์ด้วย xlsx-populate
      const workbook = await XlsxPopulate.fromDataAsync(arrayBuffer);
      const sections = this.formData.productSections;

      if (sections && sections.length > 0) {
        const templateSheet = workbook.sheet(0);

        // Clone Sheets (เริ่มจากกลุ่มที่ 2)
        for (let i = 1; i < sections.length; i++) {
          let sheetName = this.sanitizeSheetName(
            `${sheetPrefix}${sections[i].name || `Group ${i + 1}`}`
          );

          // ป้องกันชื่อซ้ำ
          while (workbook.sheet(sheetName)) {
            sheetName += `_${i + 1}`;
          }
          workbook.cloneSheet(templateSheet, sheetName);
        }

        // Rename First Sheet
        const firstSheetName = this.sanitizeSheetName(
          `${sheetPrefix}${sections[0].name || "Group 1"}`
        );
        templateSheet.name(firstSheetName);

        // Fill Data
        sections.forEach((section, index) => {
          const sheet = workbook.sheet(index);
          if (docType === "QUOTATION") this.fillQuotationSheet(sheet, section);
          else if (docType === "DELIVERY_NOTE")
            this.fillDeliverySheet(sheet, section);
          else if (docType === "RECEIPT") this.fillReceiptSheet(sheet, section);
        });
      } else {
        // กรณีไม่มีสินค้า
        const sheet = workbook.sheet(0);
        if (docType === "QUOTATION") this.fillQuotationSheet(sheet, null);
        else if (docType === "DELIVERY_NOTE")
          this.fillDeliverySheet(sheet, null);
        else if (docType === "RECEIPT") this.fillReceiptSheet(sheet, null);
      }

      return workbook;
    },

    // 2. ฟังก์ชันดาวน์โหลดแยกไฟล์เดี่ยว
    async saveBlobWithPicker(blob, fileName, options = {}) {
      const hasSavePicker =
        typeof window !== "undefined" && "showSaveFilePicker" in window;

      if (!hasSavePicker) {
        saveAs(blob, fileName);
        return "fallback";
      }

      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: fileName,
          types: options.types || [],
        });

        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return "picker";
      } catch (error) {
        if (error?.name === "AbortError") return "cancelled";

        console.warn("Save picker failed, fallback to browser download:", error);
        saveAs(blob, fileName);
        return "fallback";
      }
    },

    async downloadIndividual(docType) {
      if (this.isExporting) return;
      this.isExporting = true;
      try {
        const workbook = await this.generateWorkbook(docType);
        let fileName = "";

        if (docType === "QUOTATION") {
          fileName = `ใบเสนอราคา_${
            this.formData.quotationDocId || "Draft"
          }.xlsx`;
        } else if (docType === "DELIVERY_NOTE") {
          fileName = `ใบส่งของ_${this.formData.deliveryDocId || "Draft"}.xlsx`;
        } else if (docType === "RECEIPT") {
          fileName = `ใบเสร็จรับเงิน_${
            this.formData.receiptDocId || "Draft"
          }.xlsx`;
        }

        const blob = await workbook.outputAsync();
        const saveResult = await this.saveBlobWithPicker(blob, fileName, {
          types: [
            {
              description: "Excel Workbook",
              accept: {
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
                  ".xlsx",
                ],
              },
            },
          ],
        });

        if (saveResult === "cancelled") {
          Swal.fire("Info", "ยกเลิกการบันทึกไฟล์", "info");
          return;
        }

        Swal.fire({
          icon: "success",
          title: "บันทึกไฟล์สำเร็จ",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Single Export Error:", error);
        Swal.fire(
          "Error",
          "ไม่สามารถสร้างไฟล์ Excel ได้: " + error.message,
          "error"
        );
      } finally {
        this.isExporting = false;
      }
    },

    // 3. ฟังก์ชันดาวน์โหลดทั้งหมด (ZIP)
    async downloadAll() {
      if (this.isExporting) return;
      this.isExporting = true;
      try {
        const zip = new JSZip();
        let count = 0;

        // 3.1 Quotation (สร้างเสมอถ้าข้อมูลพร้อม แต่ createDefaultData มีค่าเริ่มต้นอยู่แล้วดึงได้เลย)
        // เพื่อความชัวร์ ดัก try-catch ย่อยเผื่อไฟล์ template หาย
        try {
          const wbQ = await this.generateWorkbook("QUOTATION");
          const blobQ = await wbQ.outputAsync();
          zip.file(
            `ใบเสนอราคา_${this.formData.quotationDocId || "Draft"}.xlsx`,
            blobQ
          );
          count++;
        } catch (e) {
          console.warn("Skip Quotation:", e);
        }

        // 3.2 Delivery Note (ถ้ามีเลขที่)
        if (this.formData.deliveryDocId) {
          try {
            const wbD = await this.generateWorkbook("DELIVERY_NOTE");
            const blobD = await wbD.outputAsync();
            zip.file(`ใบส่งของ_${this.formData.deliveryDocId}.xlsx`, blobD);
            count++;
          } catch (e) {
            console.warn("Skip Delivery:", e);
          }
        }

        // 3.3 Receipt (ถ้ามีเลขที่)
        if (this.formData.receiptDocId) {
          try {
            const wbR = await this.generateWorkbook("RECEIPT");
            const blobR = await wbR.outputAsync();
            zip.file(
              `ใบเสร็จรับเงิน_${this.formData.receiptDocId}.xlsx`,
              blobR
            );
            count++;
          } catch (e) {
            console.warn("Skip Receipt:", e);
          }
        }

        if (count > 0) {
          const content = await zip.generateAsync({ type: "blob" });
          const zipFileName = `เอกสาร_${this.formData.quotationDocId || "ชุด"}.zip`;
          const saveResult = await this.saveBlobWithPicker(content, zipFileName, {
            types: [
              {
                description: "ZIP Archive",
                accept: {
                  "application/zip": [".zip"],
                },
              },
            ],
          });

          if (saveResult === "cancelled") {
            Swal.fire("Info", "ยกเลิกการบันทึกไฟล์", "info");
            return;
          }

          Swal.fire({
            icon: "success",
            title: "บันทึก ZIP สำเร็จ",
            timer: 1500,
            showConfirmButton: false,
          });
        } else {
          Swal.fire("Info", "ไม่พบเอกสารที่จะดาวน์โหลดได้", "info");
        }
      } catch (error) {
        console.error("ZIP Export Error:", error);
        Swal.fire(
          "Error",
          "เกิดข้อผิดพลาดในการสร้าง ZIP: " + error.message,
          "error"
        );
      } finally {
        this.isExporting = false;
      }
    },

    // ฟังก์ชันช่วยทำความสะอาดชื่อ Sheet ไม่ให้มีอักขระต้องห้ามของ Excel และยาวไม่เกิน 31 ตัวอักษร
    sanitizeSheetName(name) {
      if (!name) return "";
      let safe = name.replace(/[\\/*?:\[\]]/g, "_");
      if (safe.length > 31) safe = safe.substring(0, 31);
      return safe;
    },

    // --------------------------------------------------------------------------------
    // ฟังก์ชันย่อยสำหรับหยอดข้อมูลแต่ละหน้า (แก้ Address Cells ให้ตรงกับ Template ที่นี่)
    // --------------------------------------------------------------------------------
    fillQuotationSheet(worksheet, sectionData = null) {
      // ข้อมูลส่วนหัว (จะเหมือนกันทุก Sheet)
      worksheet.cell("AM7").value(this.formData.quotationDocId); // เลขที่ใบเสนอราคา
      // ตรวจสอบว่ามีข้อมูลวันที่หรือไม่ ถ้ามีให้เปลี่ยน - เป็น /
      const formattedDate = this.formData.issueDate
        ? this.formData.issueDate.replaceAll("-", "/")
        : "";

      worksheet.cell("AM6").value(formattedDate); // วันที่ออก
      worksheet.cell("G6").value(this.formData.customerName); // ชื่อลูกค้า
      worksheet.cell("G7").value(this.formData.customerAddress); // ที่อยู่
      worksheet.cell("AN8").value(this.formData.salesman); // พนักงานขาย
      // ถ้ามีข้อมูลจะใส่ตัวเลข ถ้าไม่มีจะใส่เส้นเว้นวรรค '___'
      const days = this.formData.priceValidityDays || "___";
      worksheet.cell("AH9").value(`ยืนยันราคาที่เสนอภายใน ${days} วัน`);
      worksheet.cell("C47").value(this.formData.offererName); // ชื่อผู้เสนอราคา
      // รายการสินค้า (หยอดเฉพาะข้อมูลของ section ที่ถูกส่งเข้ามา)
      let currentRow = 14;

      if (sectionData && sectionData.items) {
        sectionData.items.forEach((item, index) => {
          // หั่นข้อความ Description ออกเป็น array ตามการขึ้นบรรทัดใหม่ (Enter)
          const descLines = item.description
            ? item.description.split("\n")
            : [""];

          // หยอดข้อมูล "บรรทัดแรก" ของสินค้านี้ (ใส่ตัวเลข ลำดับ จำนวน ราคา ครบ)
          worksheet.cell(`B${currentRow}`).value(index + 1);
          worksheet.cell(`F${currentRow}`).value(descLines[0]); // ข้อความท่อนแรก
          worksheet.cell(`AG${currentRow}`).value(item.quantity);
          worksheet.cell(`AJ${currentRow}`).value(item.unit);
          worksheet.cell(`AL${currentRow}`).value(item.unitPrice);
          worksheet.cell(`AR${currentRow}`).value(item.total);

          currentRow++; // ขยับไปบรรทัดถัดไป

          // ถ้าข้อความมีการขึ้นบรรทัดใหม่ ให้วนลูปหยอด "เฉพาะข้อความ" ลงในบรรทัดถัดๆ ไป
          for (let i = 1; i < descLines.length; i++) {
            worksheet.cell(`F${currentRow}`).value(descLines[i]);
            currentRow++;
          }
        });
      }
    },

    fillDeliverySheet(worksheet, sectionData = null) {
      worksheet.cell("G6").value(this.formData.customerName); // ชื่อลูกค้า
      worksheet.cell("G7").value(this.formData.customerAddress); // ที่อยู่
      worksheet.cell("AO8").value(this.formData.paymentTerm); // เงื่อนไขการชำระเงิน
      const formattedDueDate = this.formData.dueDate
        ? this.formData.dueDate.replaceAll("-", "/")
        : "";
      worksheet.cell("AO9").value(`${formattedDueDate}`); // วันครบกำหนด
      const formattedDate = this.formData.deliveryDate
        ? this.formData.deliveryDate.replaceAll("-", "/")
        : "";
      worksheet.cell("AO6").value(formattedDate); // วันที่
      worksheet.cell("AO7").value(this.formData.deliveryDocId); // เลขที่ใบส่งของ
      worksheet.cell("G36").value(`${this.formData.receiverName}`); // ชื่อผู้รับ
      const formattedReceivedDate = this.formData.receivedDate
        ? this.formData.receivedDate.replaceAll("-", "/")
        : "";
      worksheet.cell("G37").value(`${formattedReceivedDate}`); // วันที่รับของ
      worksheet.cell("W36").value(`${this.formData.senderName}`); // ชื่อผู้ส่ง
      const formattedSentDate = this.formData.sentDate
        ? this.formData.sentDate.replaceAll("-", "/")
        : "";
      worksheet.cell("W37").value(`${formattedSentDate}`); // วันที่ส่งของ
      worksheet.cell("AH36").value(this.formData.authorizedSigner); // ผู้มีอำนาจลงนาม
      // รายการสินค้า (สำหรับใบส่งของ ถ้าไม่ได้แยก Sheet จะนำทุกกลุ่มมาต่อกัน)
      let currentRow = 13;

      if (sectionData && sectionData.items) {
        sectionData.items.forEach((item, index) => {
          // หั่นข้อความ Description ออกเป็น array ตามการขึ้นบรรทัดใหม่ (Enter)
          const descLines = item.description
            ? item.description.split("\n")
            : [""];

          // หยอดข้อมูล "บรรทัดแรก" ของสินค้านี้ (ใส่ตัวเลข ลำดับ จำนวน ราคา ครบ)
          worksheet.cell(`B${currentRow}`).value(index + 1);
          worksheet.cell(`F${currentRow}`).value(descLines[0]); // ข้อความท่อนแรก
          worksheet.cell(`AG${currentRow}`).value(item.quantity);
          worksheet.cell(`AJ${currentRow}`).value(item.unit);
          worksheet.cell(`AL${currentRow}`).value(item.unitPrice);
          worksheet.cell(`AR${currentRow}`).value(item.total);

          currentRow++; // ขยับไปบรรทัดถัดไป

          // ถ้าข้อความมีการขึ้นบรรทัดใหม่ ให้วนลูปหยอด "เฉพาะข้อความ" ลงในบรรทัดถัดๆ ไป
          for (let i = 1; i < descLines.length; i++) {
            worksheet.cell(`F${currentRow}`).value(descLines[i]);
            currentRow++;
          }
        });
      }
    },

    fillReceiptSheet(worksheet, sectionData = null) {
      worksheet.cell("G6").value(this.formData.customerName); // ชื่อลูกค้า
      worksheet.cell("G7").value(this.formData.customerAddress); // ที่อยู่

      const formattedPaymentDate = this.formData.paymentDate
        ? this.formData.paymentDate.replaceAll("-", "/")
        : "";
      worksheet.cell("AO6").value(`${formattedPaymentDate}`); // วันที่ชำระเงิน
      worksheet.cell("AO7").value(this.formData.receiptDocId); // เลขที่ใบเสร็จ
      worksheet.cell("AO8").value(this.formData.paymentTerm); // เงื่อนไขการชำระเงิน
      const formattedDueDate = this.formData.dueDate
        ? this.formData.dueDate.replaceAll("-", "/")
        : "";
      worksheet.cell("AO9").value(`${formattedDueDate}`); // วันครบกำหนด

      //   ข้อมูลการชำระเงิน
      worksheet.cell("B8").value(this.formData.paymentMethod);
      if (this.formData.paymentMethod === "เช็คธนาคาร") {
        worksheet
          .cell("C8")
          .value(
            `${this.formData.chequeBank} สาขา ${this.formData.chequeBranch}`
          );
        worksheet.cell("D8").value(`เลขที่ ${this.formData.chequeNo}`);
      }

      // รายการสินค้า
      let currentRow = 13;
      if (sectionData && sectionData.items) {
        sectionData.items.forEach((item, index) => {
          // หั่นข้อความ Description ออกเป็น array ตามการขึ้นบรรทัดใหม่ (Enter)
          const descLines = item.description
            ? item.description.split("\n")
            : [""];

          // หยอดข้อมูล "บรรทัดแรก" ของสินค้านี้ (ใส่ตัวเลข ลำดับ จำนวน ราคา ครบ)
          worksheet.cell(`B${currentRow}`).value(index + 1);
          worksheet.cell(`F${currentRow}`).value(descLines[0]); // ข้อความท่อนแรก
          worksheet.cell(`AG${currentRow}`).value(item.quantity);
          worksheet.cell(`AJ${currentRow}`).value(item.unit);
          worksheet.cell(`AL${currentRow}`).value(item.unitPrice);
          worksheet.cell(`AR${currentRow}`).value(item.total);

          currentRow++; // ขยับไปบรรทัดถัดไป

          // ถ้าข้อความมีการขึ้นบรรทัดใหม่ ให้วนลูปหยอด "เฉพาะข้อความ" ลงในบรรทัดถัดๆ ไป
          for (let i = 1; i < descLines.length; i++) {
            worksheet.cell(`F${currentRow}`).value(descLines[i]);
            currentRow++;
          }
        });
      }
    },

    // --------------------------------------------------------------------------------
    // ส่วนฟังก์ชันเดิม (API, การคำนวณ, วันที่)
    // --------------------------------------------------------------------------------
    mapStatusToDb(thaiStatus) {
      const map = {
        ออกใบเสนอราคา: "QUOTATION",
        ออกใบส่งของ: "DELIVERY_NOTE",
        ออกใบเสร็จรับเงิน: "RECEIPT",
        ยกเลิก: "CANCELLED",
      };
      return map[thaiStatus] || "QUOTATION";
    },
    mapStatusToUi(dbStatus) {
      const map = {
        QUOTATION: "ออกใบเสนอราคา",
        DELIVERY_NOTE: "ออกใบส่งของ",
        RECEIPT: "ออกใบเสร็จรับเงิน",
        CANCELLED: "ยกเลิก",
      };
      return map[dbStatus] || "ออกใบเสนอราคา";
    },
    initDatePickers() {
      const config = {
        locale: Thai,
        dateFormat: "d-m-Y",
        disableMobile: true,
        allowInput: true,
        onReady: (d, s, i) => this.adjustYear(i),
        onMonthChange: (d, s, i) => this.adjustYear(i),
        onYearChange: (d, s, i) => this.adjustYear(i),
      };
      const keys = [
        "issueDate",
        "deliveryDate",
        "paymentDate",
        "dueDate",
        "receivedDate",
        "sentDate",
        "chequeDate",
        "dateOfReceivingMoney",
      ];
      const ids = [
        "issue-date",
        "delivery-date",
        "payment-date",
        "due-date",
        "received-date",
        "sent-date",
        "cheque-date",
        "money-received-date",
      ];
      keys.forEach((key, index) => {
        const el = document.getElementById(ids[index]);
        if (el) {
          let defaultDate = this.parseThaiDate(this.formData[key]);
          this.pickers[key] = flatpickr(el, {
            ...config,
            defaultDate: defaultDate,
            onChange: (selectedDates) => {
              if (selectedDates.length > 0)
                this.formData[key] = this.formatToThaiDate(selectedDates[0]);
              else this.formData[key] = "";
            },
          });
          this.adjustYear(this.pickers[key]);
        }
      });
    },
    formatToThaiDate(date) {
      if (!date) return "";
      const d = String(date.getDate()).padStart(2, "0");
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const y = date.getFullYear() + 543;
      return `${d}-${m}-${y}`;
    },
    parseThaiDate(dateStr) {
      if (!dateStr) return null;
      const parts = dateStr.split(/[-/]/);
      return parts.length === 3
        ? new Date(
            parseInt(parts[2], 10) > 2400
              ? parseInt(parts[2], 10) - 543
              : parseInt(parts[2], 10),
            parseInt(parts[1], 10) - 1,
            parseInt(parts[0], 10)
          )
        : null;
    },
    adjustYear(instance) {
      setTimeout(() => {
        if (instance && instance.currentYearElement)
          instance.currentYearElement.value = instance.currentYear + 543;
      }, 10);
    },
    filterPhone(event) {
      this.formData.customerPhone = event.target.value.replace(/[^0-9]/g, "");
    },
    getStatusColor(status) {
      const colors = {
        ออกใบส่งของ: "info",
        ออกใบเสร็จรับเงิน: "success",
        ยกเลิก: "error",
      };
      return colors[status] || "warning";
    },
    getStepColor(step, isDivider = false) {
      const statusStep = this.getStatusStep(this.formData.docStatus);
      const activeColor = "#4D2FB2",
        inactiveColor = "#EEEEEE",
        successColor = "#107C41";
      return step < statusStep
        ? successColor
        : step === statusStep
        ? activeColor
        : inactiveColor;
    },
    getStatusStep(status) {
      const steps = { ยกเลิก: 0, ออกใบส่งของ: 2, ออกใบเสร็จรับเงิน: 3 };
      return steps[status] || 1;
    },
    onStatusChange(newStatus) {
      if (newStatus === this.previousStatus) {
        this.statusChanged = false;
        return;
      }
      this.statusChanged = true;
      this.$nextTick(() => this.initDatePickers());
    },
    async fetchDocument() {
      this.loading = true;
      try {
        const response = await apiClient.get(`/quotation/${this.id}`);
        const data = response.data;
        const defaults = createDefaultData();

        this.formData = {
          ...defaults,
          quotationDocId: data.quotation_Id,
          docStatus: this.mapStatusToUi(data.current_status),
          customerName: data.customer_name,
          customerPhone: data.customer_phone,
          customerAddress: data.customer_address,
          customerTaxId: data.customer_tax_id,
          salesman: data.salesman,
          remark: data.remark || defaults.remark,
          issueDate: data.issue_date_str,
          priceValidityDays: data.price_validity_days,
          validUntil: data.valid_until_str,
          offererName: data.offerer_name,
          deliveryDocId: data.delivery_note_no,
          deliveryDate: data.delivery_date_str,
          paymentTerm: data.payment_term,
          dueDate: data.due_date_str,
          receiverName: data.receiver_name,
          receivedDate: data.received_date_str,
          senderName: data.sender_name,
          sentDate: data.sent_date_str,
          deliveryAddress: data.delivery_address,
          receiptDocId: data.receipt_no,
          paymentMethod: data.payment_method || defaults.paymentMethod,
          chequeBank: data.cheque_bank,
          chequeBranch: data.cheque_branch,
          chequeNo: data.cheque_no,
          chequeDate: data.cheque_date_str,
          chequeAmount: data.cheque_amount,
          receiverOfMoney: data.money_receiver_name,
          dateOfReceivingMoney: data.money_receive_date_str,
          authorizedSigner:
            data.current_status === "RECEIPT"
              ? data.receipt_authorized_signer
              : data.delivery_authorized_signer,
          productSections: (data.productSections || []).map((s) => ({
            name: s.section_name,
            items: (s.items || []).map((i) => ({
              description: i.description,
              quantity: i.quantity,
              unit: i.unit,
              unitPrice: i.unit_price,
              total: i.quantity * i.unit_price,
            })),
          })),
        };

        // ถ้ามีรายการสินค้า ให้เปิดกลุ่มแรก (index 0) ถ้าไม่มีค่อยไปหน้าเพิ่มกลุ่ม
        if (
          this.formData.productSections &&
          this.formData.productSections.length > 0
        ) {
          this.activeTab = 0;
        }

        this.previousStatus = this.formData.docStatus;
        if (data.current_status === "RECEIPT" && data.receipt_issue_date_str) {
          this.formData.issueDate = data.receipt_issue_date_str;
        }
        this.$nextTick(() => {
          Object.values(this.pickers).forEach((p) => p && p.destroy());
          this.pickers = {};
          this.initDatePickers();
          // Simulating a delay to let form settle before taking snapshot
          setTimeout(() => {
            this.originalFormData = JSON.stringify(this.formData);
          }, 500);
        });
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "ไม่สามารถดึงข้อมูลเอกสารได้", "error");
        this.$router.push("/");
      } finally {
        this.loading = false;
      }
    },
    thaiDateToSqlDate(thaiDate) {
      if (!thaiDate) return null;
      const parts = thaiDate.split(/[-/]/);
      return parts.length === 3
        ? `${parseInt(parts[2]) - 543}-${parts[1]}-${parts[0]}`
        : null;
    },
    async saveForm() {
      const { valid } = await this.$refs.quotationForm.validate();
      if (!valid) {
        Swal.fire({
          icon: "warning",
          title: "ข้อมูลไม่ครบถ้วน",
          text: "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน",
          confirmButtonText: "ตกลง",
        });
        return;
      }

      this.isSaving = true;

      this.previousStatus = this.formData.docStatus;
      this.statusChanged = false;
      const dbStatus = this.mapStatusToDb(this.formData.docStatus);

      const payload = {
        quotation_id: this.formData.quotationDocId,
        current_status: dbStatus,
        customer_name: this.formData.customerName,
        customer_phone: this.formData.customerPhone,
        customer_address: this.formData.customerAddress,
        customer_tax_id: this.formData.customerTaxId,
        salesman: this.formData.salesman,
        remark: this.formData.remark,
        issue_date_str: this.formData.issueDate,
        issue_date: this.thaiDateToSqlDate(this.formData.issueDate),
        price_validity_days: this.formData.priceValidityDays,
        valid_until_str: this.formData.validUntil,
        valid_until: this.thaiDateToSqlDate(this.formData.validUntil),
        offerer_name: this.formData.offererName,
        delivery_note_no: this.formData.deliveryDocId,
        delivery_date_str: this.formData.deliveryDate,
        delivery_date: this.thaiDateToSqlDate(this.formData.deliveryDate),
        payment_term: this.formData.paymentTerm,
        due_date_str: this.formData.dueDate,
        due_date: this.thaiDateToSqlDate(this.formData.dueDate),
        delivery_address: this.formData.deliveryAddress,
        receiver_name: this.formData.receiverName,
        received_date_str: this.formData.receivedDate,
        received_date: this.thaiDateToSqlDate(this.formData.receivedDate),
        sender_name: this.formData.senderName,
        sent_date_str: this.formData.sentDate,
        sent_date: this.thaiDateToSqlDate(this.formData.sentDate),
        delivery_authorized_signer:
          dbStatus === "DELIVERY_NOTE" ? this.formData.authorizedSigner : null,
        receipt_no: dbStatus === "RECEIPT" ? this.formData.receiptDocId : null,
        receipt_issue_date_str:
          dbStatus === "RECEIPT" ? this.formData.issueDate : null,
        receipt_issue_date:
          dbStatus === "RECEIPT"
            ? this.thaiDateToSqlDate(this.formData.issueDate)
            : null,
        payment_method: this.formData.paymentMethod,
        cheque_bank: this.formData.chequeBank,
        cheque_branch: this.formData.chequeBranch,
        cheque_no: this.formData.chequeNo,
        cheque_amount: this.formData.chequeAmount,
        cheque_date_str: this.formData.chequeDate,
        cheque_date: this.thaiDateToSqlDate(this.formData.chequeDate),
        money_receiver_name: this.formData.receiverOfMoney,
        money_receive_date_str: this.formData.dateOfReceivingMoney,
        money_receive_date: this.thaiDateToSqlDate(
          this.formData.dateOfReceivingMoney
        ),
        receipt_authorized_signer:
          dbStatus === "RECEIPT" ? this.formData.authorizedSigner : null,
        productSections: this.formData.productSections.map((s) => ({
          section_name: s.name,
          items: s.items.map((i) => ({
            description: i.description,
            quantity: i.quantity,
            unit: i.unit,
            unit_price: i.unitPrice,
          })),
        })),
      };

      try {
        if (this.isNew) {
          const res = await apiClient.post("/quotation", payload);

          this.originalFormData = JSON.stringify(this.formData);
          this.isDirty = false;

          Swal.fire({
            icon: "success",
            title: "บันทึกสำเร็จ",
            text: "สร้างเอกสารเรียบร้อยแล้ว",
            timer: 1500,
            showConfirmButton: false,
          }).then(() => {
            this.$router.replace({
              name: "TheQuotationDetail",
              params: { id: res.data.id },
            });
          });
        } else {
          await apiClient.put(`/quotation/${this.id}`, payload);

          this.originalFormData = JSON.stringify(this.formData);
          this.isDirty = false;

          Swal.fire({
            icon: "success",
            title: "บันทึกสำเร็จ",
            text: "อัปเดตข้อมูลเรียบร้อยแล้ว",
            timer: 1500,
            showConfirmButton: false,
          });
        }
      } catch (error) {
        console.error(error);
        Swal.fire(
          "Error",
          error.response?.data?.message || "บันทึกข้อมูลไม่สำเร็จ",
          "error"
        );
      } finally {
        this.isSaving = false;
      }
    },
    // การคำนวณเงิน
    calculateItemTotal(sectionIndex, itemIndex) {
      const item = this.formData.productSections[sectionIndex].items[itemIndex];
      item.total =
        (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0);
    },
    calculateSectionTotal(sectionIndex) {
      return this.formData.productSections[sectionIndex].items.reduce(
        (sum, item) => sum + (parseFloat(item.total) || 0),
        0
      );
    },
    calculateSectionVAT(sectionIndex) {
      return this.calculateSectionTotal(sectionIndex) * 0.07;
    },
    calculateSectionGrandTotal(sectionIndex) {
      return (
        this.calculateSectionTotal(sectionIndex) +
        this.calculateSectionVAT(sectionIndex)
      );
    },
    calculateSubtotal() {
      return this.formData.productSections.reduce(
        (sum, _, idx) => sum + this.calculateSectionTotal(idx),
        0
      );
    },
    calculateTotalVAT() {
      return this.formData.productSections.reduce(
        (sum, _, idx) => sum + this.calculateSectionVAT(idx),
        0
      );
    },
    calculateTotal() {
      return this.calculateSubtotal() + this.calculateTotalVAT();
    },
    formatCurrency(value) {
      return new Intl.NumberFormat("th-TH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(parseFloat(value) || 0);
    },
    addProductSection() {
      this.formData.productSections.push({ name: "", items: [] });
    },
    addProductSectionAndSwitch() {
      this.addProductSection();
      this.$nextTick(() => {
        this.activeTab = this.formData.productSections.length - 1;
      });
    },
    removeProductSection(sectionIndex) {
      Swal.fire({
        title: "ยืนยันการลบ",
        text: "ต้องการลบกลุ่มสินค้านี้ใช่หรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "ลบ",
        cancelButtonText: "ยกเลิก",
        ...swalTheme.danger,
      }).then((result) => {
        if (result.isConfirmed) {
          this.formData.productSections.splice(sectionIndex, 1);
          if (
            this.activeTab >= this.formData.productSections.length &&
            this.activeTab > 0
          ) {
            this.activeTab--;
          }
        }
      });
    },
    addItemToSection(sectionIndex) {
      this.formData.productSections[sectionIndex].items.push({
        description: "",
        quantity: 1,
        unit: "ชิ้น",
        unitPrice: 0,
        total: 0,
      });
    },
    removeItemFromSection(sectionIndex, itemIndex) {
      this.formData.productSections[sectionIndex].items.splice(itemIndex, 1);
    },
  },
};
</script>

<style scoped>
:root {
    --theme-primary: #4d2fb2;
    --theme-tint-1: #e9e4f5;
}
.bg-light-gray {
    background-color: var(--background);
 min-height: 100vh;
}
.page-container {
 min-height: 100vh;
 width: 100%;
 max-width: 100vw; /* ล็อคความกว้างไม่ให้เกินหน้าจอ */
 overflow-x: clip; /* เปลี่ยนเป็น clip เพื่อไม่ให้กระทบ sticky */
 transition: all 0.3s ease;
 background-color: var(--background);
}
.sticky-header {
 box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05) !important;
}
.section-number {
 width: 32px;
 height: 32px;
 border-radius: 50%;
 background: var(--theme-primary, #4d2fb2);
 color: white;
 font-weight: 700;
 font-size: 0.9rem;
 display: inline-flex;
 align-items: center;
 justify-content: center;
 box-shadow: 0 2px 4px rgba(77, 47, 178, 0.2);
}
.section-block {
 border: 1px solid #e9ecef;
 box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
 transition: all 0.2s ease-in-out;
}
.custom-table th {
 font-weight: 600;
 font-size: 0.85rem;
 text-transform: uppercase;
 letter-spacing: 0.5px;
}
.custom-table td {
 padding: 8px 8px !important;
 vertical-align: middle !important;
}
.mobile-scroll-table {
 min-width: 900px;
}
:deep(.v-field__input) {
 font-size: 14px !important;
}
:deep(input[type="number"]::-webkit-inner-spin-button),
:deep(input[type="number"]::-webkit-outer-spin-button) {
 -webkit-appearance: none;
 margin: 0;
}
:deep(.centered-input input) {
 text-align: center;
}
:deep(.text-right-input input) {
 text-align: right;
}
.product-tabs :deep(.v-btn) {
 text-transform: none !important;
 letter-spacing: normal;
}
.border-dashed-tab {
 border: 1px dashed #ccc !important;
 background-color: transparent !important;
}
.hover-red:hover {
 color: #dc3545 !important;
 background-color: #fff0f0;
}
.btn-save-custom {
 transition: transform 0.2s;
}
.btn-save-custom:hover {
 transform: translateY(-2px);
 box-shadow: 0 4px 12px rgba(77, 47, 178, 0.3) !important;
}
@media (min-width: 992px) {
 .page-container {
  padding-left: 280px !important;
  padding-top: 0 !important;
  padding-right: 0 !important;
 }
 .fixed-bottom-custom {
  left: 280px !important;
  width: calc(100% - 280px) !important;
  position: fixed;
 bottom: 0;
 }
}
@media (max-width: 991.98px) {
 .page-container {
  padding-top: 60px !important;
 padding-left: 0 !important;
 }
 .fixed-bottom-custom {
 left: 0 !important;
  width: 100% !important;
  position: fixed;
  bottom: 0;
  padding-bottom: env(safe-area-inset-bottom, 10px) !important;
 }
 .sticky-header {
  top: 60px !important;
 }
}
.no-scrollbar::-webkit-scrollbar {
 display: none;
}
.no-scrollbar {
 -ms-overflow-style: none;
 scrollbar-width: none;
}
</style>