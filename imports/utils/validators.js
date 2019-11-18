class validateCpf {

    constructor(CPF) {
        this.CPF = CPF ? CPF.match(/\d+/gi).join("") : "";
    }

    validate() {
        return this.CPF.length === 11 && !this.isRepeatingNumbersCpf( this.CPF ) && this.isValidCPF( this.CPF );
    }

    mod11 = ( num ) => num % 11

    isEqual = ( a ) => ( b ) => b === a 

    mergeDigits = ( num1, num2 ) => `${num1}${num2}`

    getTwoLastDigits = ( cpf ) => `${cpf[ 9 ]}${cpf[ 10 ]}`

    getCpfNumeral = ( cpf ) => cpf.substr( 0, 9 ).split( '' )
    
    isRepeatingChars( str ) {
        return str.split( '' ).every( ( elem ) => elem === str[ 0 ] )
    }
    
    toSumOfProducts = ( multiplier ) => ( result, num, i ) => 
      result + ( num * multiplier-- )
    
    getSumOfProducts = ( list, multiplier ) => 
      list.reduce( this.toSumOfProducts( multiplier ), 0 )
    
    getValidationDigit = ( multiplier ) => ( cpf ) =>
      this.getDigit( this.mod11( this.getSumOfProducts( cpf, multiplier ) ) )
    
    getDigit = ( num ) => 
      ( num > 1 )
        ? 11 - num
        : 0
    
    isRepeatingNumbersCpf = this.isRepeatingChars
    
    isValidCPF = ( cpf ) => {
      const CPF = this.getCpfNumeral( cpf )
      const firstDigit = this.getValidationDigit( 10 )( CPF )
      const secondDigit = this.getValidationDigit( 11 )( CPF.concat( firstDigit ) )
      
      return this.isEqual(this.getTwoLastDigits( cpf ))(this.mergeDigits(firstDigit, secondDigit))
    }
}

export const validateCPF = CPF => new validateCpf( CPF ).validate();

  
const TYPE_VALIDATORS = {
    cpf: (cpf) => !validateCPF(cpf) ? 'CPF inválido' : null,
    email: (email) => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email) ?  null : 'Email inválido'
}

export const validator = (type, value, required = false) => {

    if (!value) {
      return required ? 'Campo obrigatório' : null;
    }
  
    const validatorIsValid = TYPE_VALIDATORS[type];
  
    return validatorIsValid ? validatorIsValid(value) : null;
  }