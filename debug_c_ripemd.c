#include <stdio.h>
#include <string.h>
#include <stdint.h>

// Include the RIPEMD160 function declaration
void ripemd160(const uint8_t *msg, uint32_t msg_len, uint8_t *hash);

int main() {
    uint8_t hash[20];
    const char* test = "a";
    uint32_t len = strlen(test);
    
    printf("Input: '%s' (%d bytes)\n", test, len);
    printf("Input bytes: ");
    for (int i = 0; i < len; i++) {
        printf("%02x ", (uint8_t)test[i]);
    }
    printf("\n");
    
    ripemd160((uint8_t*)test, len, hash);
    
    printf("RIPEMD160 result: ");
    for (int i = 0; i < 20; i++) {
        printf("%02x", hash[i]);
    }
    printf("\n");
    
    return 0;
}