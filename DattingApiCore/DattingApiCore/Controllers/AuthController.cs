using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DattingApiCore.Data;
using DattingApiCore.Dtos;
using DattingApiCore.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DattingApiCore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _repo;
        private readonly IConfiguration config;
        private readonly IMapper mapper;

        public AuthController(IAuthRepository repo, IConfiguration config,IMapper mapper)
        {
            this._repo = repo;
            this.config = config;
            this.mapper = mapper;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDto userForRegisterDto)
        {
            // validate request

            userForRegisterDto.Username = userForRegisterDto.Username.ToLower();

            if( await _repo.UserExist(userForRegisterDto.Username))
            {
                return BadRequest("Username aleardy exists.");
            }

            var userToCreate = mapper.Map<User>(userForRegisterDto);

            var userCreated = await _repo.Register(userToCreate, userForRegisterDto.Password);

            var userToReturn = mapper.Map<UserForDetailDto>(userCreated);

            return CreatedAtRoute("GetUser", new { controller= "Users", id= userCreated.Id }, userToReturn);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDto userForLoginDto)
        {

            var userForRepo = await _repo.Login(userForLoginDto.Username.ToLower(), userForLoginDto.Password);

            if (userForRepo == null)
                return Unauthorized();

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userForRepo.Id.ToString()),
                new Claim(ClaimTypes.Name, userForRepo.Username)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config.GetSection("AppSettings:Token").Value));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject=new ClaimsIdentity(claims),
                Expires=DateTime.Now.AddDays(1),
                SigningCredentials=creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            var user = mapper.Map<UserForListDto>(userForRepo);

            return Ok(new { 
                    token=tokenHandler.WriteToken(token),
                    user
            });
            
        }
    }
}