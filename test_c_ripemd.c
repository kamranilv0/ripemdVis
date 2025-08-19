#include <stdio.h>
#include <string.h>
#include <stdint.h>

// Include the RIPEMD160 function declaration
void ripemd160(const uint8_t *msg, uint32_t msg_len, uint8_t *hash);

int main() {
    uint8_t hash[20];
    const char* test = "";
    
    ripemd160((uint8_t*)test, strlen(test), hash);
    
    printf("RIPEMD160(\"%s\") = ", test);
    for (int i = 0; i < 20; i++) {
        printf("%02x", hash[i]);
    }
    printf("\n");
    
    const char* test2 = "a";
    ripemd160((uint8_t*)test2, strlen(test2), hash);
    
    printf("RIPEMD160(\"%s\") = ", test2);
    for (int i = 0; i < 20; i++) {
        printf("%02x", hash[i]);
    }
    printf("\n");
    
    return 0;
}